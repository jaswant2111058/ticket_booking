const express = require('express');
const app = express();
require('dotenv').config();
const session = require('express-session');
const passport = require('passport');
const port = process.env.PORT || 5000;
require('./auth');
app.set("view engine", 'ejs');
const path = require("path");
require("./connection/conn");
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
const userDetail = require("./model/userDetail")
const avalabilityDetail = require("./model/avalabilityDetail")
const adminDetail = require("./model/adminDetail")
const paymentDetail = require("./model/paymentDetail")
const static1 = path.join(__dirname, "/views")
app.use(express.static(static1));
const cookiejk = require("cookie-parser");
const bodyParser = require("body-parser")
const jwt = require("jsonwebtoken");
const key = process.env.SESSION_SECRET;
const time = 1000 * 15 * 60;
app.use(cookiejk());
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
var nodemailer = require('nodemailer');
const bcrypt = require('bcrypt');
let otpsend = process.env.OTP;
let useremail = process.env.EMAIL;

//--------------------------mail sending function----------------------------------------
function sendmail(email) {
  const random = Math.floor(Math.random() * 99999) + 10000;

  console.log(random);
  var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: "jkstar0123@gmail.com",
      pass: process.env.EMAIL_PASS,
    }
  })
  var mailOptions = {
    from: 'jkstar0123@gmail.com',
    to: `${email}`,
    subject: 'registor email verification',
    html: `OTP IS ${random}`
  }
  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  })
  return random;
}

//-------------------------------sendMailTicket----------------------------//


function sendmail(email, detail) {

  var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: "jkstar0123@gmail.com",
      pass: process.env.EMAIL_PASS ,
    }
  })

  const dtl = JSON.stringify(detail);

  var mailOptions = {
    from: 'jkstar0123@gmail.com',
    to: `${email}`,
    subject: 'registor email verification',
    html: `booking detail IS ${dtl}`
  }
  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  })
}

//------------------------------google passport-----------------------------------------//
app.get('/auth/google',
  passport.authenticate('google', { scope: ['email', 'profile'] }
  ));
app.use(session({ secret: "jassi", resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());
//--------------------------------------middleware------------------------------------------------//
function isLoggedIn(req, res, next) {

  if (req.user) {
    next()
  } else {
    try {
      let token = req.params.token || req.cookies.token;
      if (token) {
        let user = jwt.verify(token, key);
        if (user) {
          req.userid = user.id;
          req.useremail = user.email;

          next();
        }
        else {
          res.redirect("/")
        }
      } else {
        res.redirect("/")
      }

    } catch (err) {
      console.log(err);
      res.status(500);
      res.redirect("/");
    }
  }

}

//------------------------------google call back-----------------------------------------------//

app.get('/auth/google/callback',
  passport.authenticate('google', {
    successRedirect: '/googlelogin',
    failureRedirect: '/auth/google/failure'
  })
);


//------------------------------api-----------------------------------------------//


//login get

app.get("/", (req, res) => {

  res.render("login")
})


//signup get

app.get("/signup", (req, res) => {

  res.render("signup")
})


//signup post

app.post('/signup', async (req, res) => {
  const pass = req.body.password;
  //const adnew= schema.findOne(res.body.email)

    const detail = { user_email: req.body.email, password: pass, user_name: req.body.username, email_status: "notverified" }

    try {
      const usr = new adminDetail(detail)
      const adnew = await usr.save();
      const otp = sendmail(req.body.email);
      otpsend = `${otp}`;
      res.render("otpverification", { email: req.body.email })
    }
    catch
    {
      res.status(400).send("email is all ready register" + "<html><br><br><a href='/'>return<a></html>");
    }


  

})


//otp verification

app.post("/otpverification", async (req, res) => {


  if (otpsend === req.body.otp) {
    await schema.updateOne({ user_email: req.body.email }, { email_status: "verified" });
    res.redirect("/")
  }
  else {
    res.send("otp is not matching")

  }

})


//login post

app.post("/login", async (req, res) => {

  try {
    const lemail = req.body.email
    const lpassword = req.body.password

    const semail = await schema.findOne({ user_email: lemail })
    if (semail && semail.email_status === "verified") {
      // res.send(semail)

      // const pcheck = await bcrypt.compare(lpassword, semail.password)

      if (lpassword != semail.password) {

        res.send("password not match");
      }
      else {
        const token = jwt.sign({ email: semail.email, id: semail._id }, key)
        res.cookie("token", token, {
          expires: new Date(Date.now() + time),
          httpOnly: true
        })
        console.log(token);
        useremail = lemail;
        res.redirect("/user_logged_in")
      }
    }
    else
      res.send("Email is not register" + "<html><br><br><a href='/'>signup<a></html>")
  }

  catch (e) {
    res.status(400).send(e);
  }
})


//forget password get

app.get("/forgetpassword", (req, res) => {

  res.render("forgetpassword");

})


// forget password post

app.post("/forgetpassword", async (req, res) => {
  const semail = await schema.findOne({ user_email: req.body.email })
  if (!semail) {
    res.send("Email is not register" + "<html><br><br><a href='/'>signup<a></html>")
  }
  else {
    const otp = sendmail(req.body.email);
    otpsend = `${otp}`;
    res.render("fov", { email: req.body.email })
  }

})


//forget password otp verification

app.post("/fov", async (req, res) => {


  if (otpsend === req.body.otp) {
    await schema.updateOne({ user_email: req.body.email }, { password: req.body.password });
    res.redirect("/")
  }
  else {
    res.send("otp is not matching" + "<html><br><br><a href='/'>signup<a></html>")

  }

})


//google passport login

app.get("/googlelogin", isLoggedIn, async (req, res) => {
  try {
  useremail = req.user.email;
  const semail = await adminDetail.findOne({ org_email: req.user.email })
  if (!semail) {
    
      const detail = { org_name: req.user.displayName, org_email: req.user.email, email_status: "verified" }

      const usr = new adminDetail(detail);
      const adnew = await usr.save();
      // res.status(201).send(adnew);
      res.redirect("/user_logged_in");
    
    
  }
  else {
    res.redirect("/user_logged_in");
  }
}
  catch (error) {
    res.status(400).send(error);
  }
})

app.post('/create/orderId', isLoggedIn, async (req, res) => {
  try {
  let options = {
    amount: req.body.amount,  // amount in the smallest currency unit
    currency: "INR",
    receipt: "order_rcptid_11"
  };
  instance.orders.create(options, async function (err, order) {
    console.log(order);
    // res.send({orderId:order.id})
    
      const adnew = await paymentDetail.findOne({ user_email: req.body.email });
      if(!adnew)
      {
        const data = new paymentDetail({user_email:req.body.email})
        await data.save();
      }
    res.render("payment", { order: order.id, adnew });
    
    
  })
}
  catch (e) {
    console.log("error");
  };
})


app.post("/api/payment/verify", isLoggedIn, async (req, res) => {

  //const adnew = await schema.findOne({leader_email:req.user.email})
  
  try{

    let body = req.body.razorpay_order_id + "|" + req.body.razorpay_payment_id;

  var crypto = require("crypto");
  var expectedSignature = crypto.createHmac('sha256', process.env.KEY_SECRET)
    .update(body.toString())
    .digest('hex');
  console.log("sig received ", req.body.razorpay_signature);
  console.log("sig generated ", expectedSignature);
  var response = { "signatureIsValid": "false" }

  if (expectedSignature === req.body.razorpay_signature) {
    const adnew = await paymentDetail.findOne({ email: req.body.email });
    adnew.paymentStatus.push("successfull")
    adnew.paymentId.push(req.body.razorpay_payment_id)
    adnew.orderId.push(req.body.razorpay_order_id)
    adnew.signature.push("verified")
    adnew.counter = adnew.counter + 1;
    const keep = await paymentDetail.updateOne({ email: req.user.email }, { paymentStatus: adnew.paymentStatus, signature: adnew.sinature, paymentId: req.body.razorpay_payment_id, orderId: req.body.razorpay_order_id, counter: adnew.counter });


    res.send(adnew);

  }
  else {
    const keep = await paymentDetail.updateOne({ email: req.user.email }, { paymentStatus: "unsuccessfull" });
    //  console.log(req.body.razorpay_order_id,req.body.razorpay_payment_id,req.body.razorpay_signature);
    res.send("payment is not veryfied");
  }
  }
  catch
    {
      res.status(400).send("Internal serever error" + "<html><br><br><a href='/'>return<a></html>");
    }



});

app.post("/event/hosting", async (req, res) => {

  
  try{
    let eventDetail = {
      venue: req.body.venuecode,
      date: req.body.date,
      time: req.body.time, 
  
    }
  eventDetail = JSON.stringify(eventDetail);
  let data = await adminDetail.findOne({ email: req.body.email })
  data = JSON.parse(data.eventDetail)
  data.push(eventDetail);
  await adminDetail.updateOne({ email: req.body.email }, { eventDetail: data })
  let seats = JSON.parse(req.body.seat)
  const detail={eventId:eventDetail,total_seats:seats,avalable_seats:seats};
  const genEnventId = new avalabilityDetail(detail);
  await genEnventId.save();
  }
  catch
    {
      res.status(400).send("Internal serever error" + "<html><br><br><a href='/'>return<a></html>");
    }
})









app.post("/ticket/genrate", async (req, res) => {

try{
  
  bcrypt.hash(req.body.eventId, 12, async function (err, hash) {
    const TicketId = JSON.parse(req.body.eventId) ;
    const seat_deatil = JSON.parse(req.body.seat)
    const bookedTickets = {
      TicketId: hash, seat: seat_deatil, eventId:TicketId,
    }
   
    const data = JSON.stringify(bookedTickets)
    let detail= {TicketId:hash,email:req.body.email}
    detail= JSON.stringify(detail);

  
      const data1 = await userDetail.findOne({ user_email: req.body.email });
      if (data1) {
        data1.bookedTickets.push(data);
        const adnew = await userDetail.updateOne({ user_email: req.body.email }, { bookedTickets: data1.bookedTickets })
      }
      else {
        const detail = { user_name: req.body.name, user_email: req.body.email, bookedTickets: data }
        const addnew = new userDetail(detail);
        await addnew.save();
      }
      const event_data = await avalabilityDetail.findOne({ eventId: req.body.eventId });

        function seatRemove(arr, value) {
          var index = arr.indexOf(value);
          if (index > -1) {
            arr.splice(index, 1);
          }
          return arr;
        }
        const totalSeat = JSON.parse(event_data.total_seats)
        for (let i = 0; i < seat_deatil.lenght; i++) {
          seatRemove(totalSeat, seat_deatil[i]);
        }
        const seatbooked = JSON.parse(event_data.booked_seats)
        seatbooked.push(seat_deatil);
        const event_adnew = await avalabilityDetail.updateOne({ eventId: req.body.eventId }, { booked_seats: seatbooked }, { avalable_seats: totalSeat })
      
      
      const payment = await paymentDetail.findOne({ email: req.body.email });
      payment.ticketId.push(hash);
      const keep = await paymentDetail.updateOne({ email: req.user.email }, { ticketId: payment.ticketId });
      sendmailTicket(req.body.email, detail);

      res.render("ticketDetail", { ticketDetail: detail })
    
     console.log(hash);
  })
}
catch
{
  res.status(400).send("Internal serever error" + "<html><br><br><a href='/'>return<a></html>");
}
  
})

app.post("/ticket/verification", async (req, res) => {

  
  try{
    const ticketid = JSON.parse(req.body.ticketId);
  const adnew = await userDetail.findOne({ email: ticketid.email });
  let ticId = JSON.parse(adnew.bookedTickets)
  ticId=ticId.pop();
  if (ticketid.TicketId === ticId.TicketId) {
    res.send("verified"+ticId)
  }
  else {
    res.send("notverified")
  }
}
catch
    {
      res.status(400).send("Internal serever error" + "<html><br><br><a href='/'>return<a></html>");
    }

})


app.listen(port, () => console.log("server is up....."));
