const bcrypt = require('bcrypt');
const speakeasy = require('speakeasy');
const qrCode = require('qrcode');
const jwt = require('jsonwebtoken');
const pool = require('../config/db');
const passport = require('passport');

const register = async (req, res) => {
    console.log(req.body);
    try {
        const { email, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const result = await pool.query('INSERT INTO usuarios (email, password_hash, is_twofa_enabled) VALUES ($1, $2, $3) RETURNING id', [email, hashedPassword, false]);
        console.log(result);
        return res.status(201).json({ message: 'Usuario registrado exitosamente', userId: result.rows[0].id });
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Error en el registro' });
    }
};

const login = async (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
        if (err) return next(err);
        if (!user) return res.status(400).json({ message: info.message });

        try {
            // Aquí NO se hace login todavía, se genera el código 2FA
            // Lógica para generar y enviar el código 2FA al usuario
            const code = speakeasy.totp({
                    secret: user.twofa_secret,
                    encoding: 'base32'
                });
            

            console.log("Código 2FA generado:", code); // En producción se envía por email/SMS

            return res.json({
                message: "Código enviado",
                userId: user.id
            });
        }
        catch (error) {
            res.status(500).json({ message: 'Error en el login' });
        }

    })(req, res, next);
}; 
       



const authStatus = async (req, res) => {
    try {
        if (req.user) {
            return res.json(
                {
                    authenticated: true,
                    user: req.user.email,
                    isMfaEnabled: req.user.is_twofa_enabled
                });
        } else {
            return res.json({ authenticated: false });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error verificando estado de autenticación' });
    }
};
const logout = async (req, res) => {
    console.log("Logout request session:", req.session);
   try {
    // 1. Cerrar sesión de Passport
    req.logout(err => {
      if (err) {
        console.error("Error en logout:", err);
        return res.status(500).json({ message: "Error cerrando sesión" });
      }

      // 2. Destruir la sesión del servidor
      req.session.destroy(err => {
        if (err) {
          console.error("Error destruyendo sesión:", err);
          return res.status(500).json({ message: "Error cerrando sesión" });
        }

        // 3. Respuesta final
        return res.json({ message: "Sesión cerrada correctamente" });
      });
    });

  } catch (error) {
    console.error("Error en logout:", error);
    res.status(500).json({ message: "Error cerrando sesión" });
  }

};

/*ESTE CODIGO SOLO SIRVE CUANDO EL USUARIO ACTIVA 2FA DESDE SU PERFIL
Y NO EN EL LOGIN INICIAL

const setup2FA = async (req, res) => {
    try {
        console.log('Setup 2FA for user:', req.user);
        const user = req.user;
        const secret = speakeasy.generateSecret();
        console.log('Generated secret:', secret);
        await pool.query('UPDATE usuarios SET twofa_secret=$1, is_twofa_enabled=$2 WHERE id=$3', [secret.base32, true, user.id]);
        const url = speakeasy.otpauthURL(
            {
                secret: secret.base32,
                label: user.email,
                issuer: 'BCPortal',
                encoding: 'base32'
            });
        const qrImageUrl = await qrCode.toDataURL(url);
        return res.json({ message: '2FA configurado', secret: secret.base32, qrImageUrl });
    } catch (error) {
        res.status(500).json({ message: 'Error en la configuración de 2FA' });
    }
};*/

const setup2FA = async (req, res) => {
    try {
        const user = req.user;

        /*
        // 1. Evitar regenerar secret si ya existe
        if (user.is_twofa_enabled && user.twofa_secret) {
            return res.status(400).json({
                message: 'El usuario ya tiene 2FA configurado'
            });
        }*/

        // 2. Generar secret solo una vez
        const secret = speakeasy.generateSecret({
            name: `BCPortal (${user.email})`,
            length: 20
        });

        await pool.query(
            'UPDATE usuarios SET twofa_secret=$1, is_twofa_enabled=$2 WHERE id=$3',
            [secret.base32, true, user.id]
        );

        /*
        // 3. Crear URL para Google Authenticator
        const url = speakeasy.otpauthURL({
            secret: secret.base32,
            label: user.email,
            issuer: 'BCPortal',
            encoding: 'base32'
        });*/

        // 3. Crear URL para Google Authenticator (nueva forma)
        const otpauthUrl = secret.otpauth_url;

        // 4. Generar QR
        const qrImageUrl = await qrCode.toDataURL(otpauthUrl);

        return res.json({
            message: '2FA listo para escanear',
            qrImageUrl,
            secret: secret.base32
            // NO regreses el secret en producción
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error generado 2FA' });
    }
};


const verify2FA = async (req, res) => {
    try {
        const {userId, code } = req.body;
        if(!userId || !code){
            return res.status(400).json({ message: 'Faltan parámetros' });
        }

        //Obtener Usuario de la BD
        const result = await pool.query('SELECT * FROM usuarios WHERE id=$1', [userId]);
        const dbUser = result.rows[0];
        console.log("User id:",dbUser);
        if(!dbUser){
            return res.status(400).json({ message: 'Usuario no encontrado' });
        }
        //Verificar código TOTP
        const verified = speakeasy.totp.verify({
            secret: dbUser.twofa_secret,
            encoding: 'base32',
            token:code,
            window: 1
        });
        if (!verified) {
            return res.status(400).json({ message: 'Código incorrecto' });
        }
        //Autenticar al usuario en la sesion(Passport)
        req.login(dbUser, (err) => {
            if (err) {
                return res.status(500).json({ message: 'Error al autenticar usuario' });
            }
            //GENERA JWT
            const jwtToken = jwt.sign(
                { id: dbUser.id, email: dbUser.email },
                process.env.JWT_SECRET,
                { expiresIn: '1h' }
            );
            return res.json({ message: 'Autenticado', token: jwtToken });
        });

    } catch (error) {
        console.log("Error en verificacion: ",error)
        res.status(500).json({ message: 'Error en la verificación de 2FA' });
    }
};

const reset2FA = async () => {
    try {
        const user = req.user;
        await pool.query('UPDATE usuarios SET twofa_secret=$1, is_twofa_enabled=$2 WHERE id=$3', [null, false, user.id]);
        return res.json({ message: '2FA reiniciado' });
    } catch (error) {
        res.status(500).json({ message: 'Error al reiniciar 2FA' });
    }
};

module.exports = { register, login, authStatus, logout, setup2FA, verify2FA, reset2FA };
