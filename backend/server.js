const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');
const cookieParser = require("cookie-parser");
require('dotenv').config();
const mt5Routes = require("./routes/mt5Routes");
const userRoutes = require('./routes/userRoutes');
const roleRoutes = require('./routes/roleRoutes');
const permissionRoutes = require('./routes/permissionRoutes');
const authRoutes = require('./routes/authRoutes');





const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(cors());


connectDB();

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/channels', require('./routes/channelRoutes'));
app.use("/api/mt5", require("./routes/mt5Routes"));
app.use('/api/user', require('./routes/channelRoutes'));

app.use('/api/mt5', mt5Routes);
app.use('/api/users', userRoutes);
app.use("/api/auth", authRoutes); 

app.use("/api/auth", require("./routes/userRoutes"));
app.use("/api/users", require("./routes/userRoutes"));



app.use('/api', roleRoutes);
app.use('/api/permissions', permissionRoutes);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
