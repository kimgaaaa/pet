const express=require("express");
const cors=require("cors");
const app=express();
const models=require("./models");
const multer=require('multer');
const upload = multer({
   storage: multer.diskStorage({
     destination: function (req, file, cb) {
      cb(null, "uploads/");
     },
     filename: function (req, file, cb) {
      cb(null, file.originalname);
     },
   }),
});
const port="8080";

app.use(express.json());
app.use(cors());
app.use("/uploads", express.static('uploads'));

app.get("/products", (req, res) => {
   models.Product.findAll({
      order: [["createdAt", "DESC"]],
      attributes: ["id", "name", "price", "seller", "imageUrl", "createdAt"],
   })
      .then((result) => {
         console.log("PRODUCTS : ", result);
         res.send({
            products: result,
         });
      })
      .catch((error) => {
         console.error(error);
         res.send("에러 발생");
      });
});

app.get("/products/:id", (req, res)=>{
   const params=req.params;
   const {id}=params;
   models.Product.findOne({
      where: {
         id:id,
      }
   }).then((result)=>{
      console.log("PRODUCT:", result);
      res.send({
         product: result
      })
   })
   .catch((error)=>{
      console.error(error);
      res.send("에러발생")
   })
})

app.post('/image', upload.single('image'), (req, res) =>{
   const file=req.file;
   res.send({
      imageUrl:file.path,
   })
})


app.post('/products', (req, res) =>{
   const body = req.body
   const {name, description, price, seller} = body;

   if(!name|| !description || !price || !seller){
      res.send("모든 필드를 입력해주세요")
   }
   models.Product.create({
      name, 
      description,
      price,
      seller   
   }).then((result)=>{
      console.log('상품생성결과:',result);
      res.send({result})
   }).catch((error)=>{
      console.error(error);
      res.send('상품업로드에 문제가 발생했습니다.')
   })
})
app.post('/products/:id', (req, res) =>{
   res.send('상품이 등록되었습니다.')
})
app.post('/image',upload.single('image'), (req, res) =>{
   const file=req.file;
   console.log(file);
   res.send({
      imageUrl:file.path,
   })
})
app.post('/login', (req, res) =>{
   res.send('로그인해주세요')
})


app.listen(port, ()=>{
   console.log('쇼핑몰 서버가 돌아가고 있어요')
   models.sequelize   
   .sync()
   .then(() => {
      console.log('✓ DB 연결 성공');
   })
   .catch(function (err) {
      console.error(err);
      console.log('✗ DB 연결 에러');
            //에러발생시 서버프로세스 종료
      process.exit();
   });
});
