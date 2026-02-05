// server.js mein app.listen se upar hona chahiye
const userRoutes = require('./routes/userRoutes');
app.use('/api/users', userRoutes);