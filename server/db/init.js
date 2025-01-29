var crypto = require('crypto')
const mongoose = require('mongoose');
const User = require('./user.js');
const Follower = require('./follower.js');
const Post = require('./post.js');
const Comment = require('./comment.js');
const CommentLike = require('./comment_like.js');
const PostLike = require('./post_like.js');
const Password = require('./password.js');
const { faker } = require('@faker-js/faker');
const jwt_utils = require('../middleware/token.js');

const hash_psw = jwt_utils.hash_psw

mongoose.connect('mongodb://localhost:27017/sketch_db', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => console.log('Database connected!'))
.catch(err => console.error('Database connection error:', err));

async function initializeDatabase() {
    try {
        console.log('Database creation start!');
        
        // Crea 10 profili realistici
        const admin = new User({username:"admin",
            email:"none@admin.io",
            //password:hash_psw("admin"),
            img: `https://picsum.photos/seed/admin/200/300`, // URL immagine casuale
            caption:faker.lorem.sentence()
        })
        const admin_psw = new Password({
            password: hash_psw("admin"),
            username__user_key: admin._id
        })
        const users = [await admin.save()];
        const passwords = [await admin_psw.save()];
        for (let i = 0; i < 10; i++) {
            const user = new User({
                username: faker.internet.userName(),
                email: faker.internet.email(),
                //password: hash_psw(faker.internet.password()),
                img: `https://picsum.photos/seed/${500+i}/200/300`, // URL immagine casuale
                caption:faker.lorem.sentence(),
            });
            const password = new Password({
                password: hash_psw(`psw_${user.username}`),
                username__user_key: user._id
            })
            passwords.push(await password.save());
            users.push(await user.save());
        }
        console.log('10 realistic user profiles created!');
        
        // Crea 60 relazioni di follower
        fw = []
        while (fw.length<60){
            const follower = users[Math.floor(Math.random() * users.length)];
            const followed = users[Math.floor(Math.random() * users.length)];
            const folstring=`${follower._id.toString()}-${followed._id.toString()}`
            
            if (fw.includes(folstring)||follower._id.toString() == followed._id.toString()){
                continue
            }else{
                fw.push(folstring)
            }
            // Assicurati che il follower e il followed siano diversi
            await Follower.create({
                follower__user_key: follower._id,
                followed__user_key: followed._id,
            });
        }
        console.log('50 follower relationships created!');
        
        // Crea 150 post realistici
        const posts = [];
        for (let i = 0; i < 150; i++) {
            const owner = users[Math.floor(Math.random() * users.length)];
            const post = new Post({
                owner__user_key: owner._id,
                img: `https://picsum.photos/seed/${500+i}/200/300`, // URL immagine casuale
                caption: faker.lorem.sentence(), // Didascalia realistica
            });
            posts.push(await post.save());
        }
        console.log('150 realistic posts created!');
        
        // Crea 150 like sui post
        var likep = []
        while (likep.length < 150) {
            const liker = users[Math.floor(Math.random() * users.length)];
            const post = posts[Math.floor(Math.random() * posts.length)];
            const likepstring=`${liker._id.toString()}-${post._id.toString()}`
            
            if (likep.includes(likepstring)){
                continue
            }else{
                likep.push(likepstring)
            }
            await PostLike.create({
                from__user_key: liker._id,
                to__post_key: post._id,
            });
        }
        console.log('150 post likes created!');
        
        // Crea 155 commenti realistici
        const comments = [];
        for (let i = 0; i < 155; i++) {
            const author = users[Math.floor(Math.random() * users.length)];
            const post = posts[Math.floor(Math.random() * posts.length)];
            
            const comment = new Comment({
                content: faker.lorem.sentences(2), // Testo del commento realistico
                author__user_key: author._id,
                target__post_key: post._id,
            });
            comments.push(await comment.save());
        }
        console.log('155 realistic comments created!');
        
        // Crea 50 like sui commenti
        var likec = []
        while (likec.length < 50) {
            const liker = users[Math.floor(Math.random() * users.length)];
            const comment = comments[Math.floor(Math.random() * posts.length)];
            const likecstring=`${liker._id.toString()}-${comment._id.toString()}`
            
            if (likec.includes(likecstring)){
                continue
            }else{
                likec.push(likecstring)
                
                await CommentLike.create({
                    from__user_key: liker._id,
                    to__comment_key: comment._id,
                });
            }
        }
        console.log('50 comment likes created!');
        
        console.log('Database initialization complete with realistic data!');
    } catch (err) {
        await mongoose.connection.dropDatabase();
        console.error('Error initializing database:', err);
    } finally {
        mongoose.connection.close();
    }
}

// Esegui lo script
initializeDatabase();
