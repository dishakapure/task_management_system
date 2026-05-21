const pool = require("../config/db");
const jwt = require("jsonwebtoken");

//signup

const signup = async(req , res) => {
    try {
        const{
            name,
            email,
            password,
        } = req.body;
        const existingUser = await pool.query("SELECT * FROM users WHERE email= $1", [email]);

        if (existingUser.rows.length > 0){
            return res.status(400).json({
                message: "User already exists"
            });
        }

const result = await pool.query(
    `INSERT INTO users(name, email, password) vALUES ($1, $2, $3) RETURNING id, name, email`,
    [name, email, password]
);
const user = result.rows[0];
const token = jwt.sign(
    {id: user.id},
    process.env.JWT_SECRET,
    {
        expiresIn: "7d"
    }
);
res.status(201).json({
    token,
    user
});
    } catch (error) {
        
        res.status(500).json({
            message: error.message
        });
    }
};



//login

const login = async (req, res) => {

    try {

        const {
            email,
            password
        } = req.body;


        const result = await pool.query(
            "SELECT * FROM users WHERE email = $1",
            [email]
        );


        if (result.rows.length === 0) {

            return res.status(400).json({
                message: "Invalid credentials"
            });
        }


        const user = result.rows[0];


        if (password !== user.password) {

            return res.status(400).json({
                message: "Invalid credentials"
            });
        }


        const token = jwt.sign(
            {
                id: user.id
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "7d"
            }
        );


        res.json({
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email
            }
        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });
    }
};

module.exports = {
    signup, login
};