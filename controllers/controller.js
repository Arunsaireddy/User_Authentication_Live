import bcrypt from "bcrypt";
import { request } from "express";

import session from "express-session";

import driverModel from "../models/driverModel.js";

class Controller {
  

// Signup Get
  static signup_get = (req, res) => {
    const myMsg = req.session.msg;

    // delete req.session.msg;

    res.render("signup.ejs", { myMsg, navbar : req.session.isValid ? "user_authenticated" : "user_unauthenticated"
  });
  };


  // Signup Post
  static signup_post = async (req, res) => {
    try {
      const form_data = req.body;

      console.log(form_data);

      // Cofirm that this is not an existing user

      let user = await driverModel.findOne({ username: form_data.username });

      req.session.user = user;

      
      if (user) {
        req.session.msg = `${user.username} is an existing user please login !!!`;
        return res.redirect("/login");
      } else if (form_data.password != form_data.repeatpassword) {
        console.log(
          "Passwords didnt match. Please enter coreect password !!!!!!!"
        );
        req.session.msg =
          "Password didn't Match. Please enter the correct password.";
        //delete req.session.msg;
        return res.redirect("/signup");
      }

      const hashedpassword = await bcrypt.hash(form_data.password, 10);

      if (!user) {
        user = new driverModel({
          firstName: "default",
          lastName: "default",
          licenseNo: "default",
          age: "0",
          username: form_data.username,
          password: hashedpassword,
          userType: form_data.userType,

          car_details: {
            make: "default",
            model: "default",
            year: "0",
            platno: "default",
          },
        });

        const user_saved = await user.save();

        console.log("User data saved in Db: " + user_saved);

        req.session.msg = `Signup Successfull !!! Please Login Dear  ${user.username} `;

        return res.redirect("/login");
      }
    } catch (err) {
      console.log(err);
      res.send(err);
    }
  };


  // Login Get
  static login_get = (req, res) => {
    //   req.session.isValid =true
    //  console.log(req.session)
    //  console.log(req.session.id)

    const myMsg = req.session.msg;

    console.log(req.session);

    delete req.session.msg;

    console.log("======================================");

    console.log(session);

    res.render("login.ejs", { myMsg, navbar: req.session.isValid ? "user_authenticated" : "user_unauthenticated" });
  };


  // Login post 
  static login_post = async (req, res) => {
    try {
      const form_data = req.body;

      const existing_user = await driverModel.findOne({
        username: form_data.username
      });

      if (!existing_user) {
        console.log("Please SignUp first !!!!");
        req.session.msg = `${form_data.username} Please Signup First !!!`;
        return res.redirect("/signup");
      } else if(existing_user.userType == "Driver"){
        const userpassword_matched = await bcrypt.compare(
          form_data.password,
          existing_user.password
        );
        if (userpassword_matched) {
          req.session.isValid = true;

          req.session.user = existing_user;

          req.session.msg = `Welcome Dear ${existing_user.username} on Dasboard Page !!!`;
          return res.redirect("/dashboard");
        } else {
          console.log("Password is incorrect......");
          req.session.msg = `Password is not Correct, ${existing_user.username}  !!!`;
          return res.redirect("/login");
        }
      }
      else
      {
        req.session.msg = `Dear ${existing_user.username}, User Type with Driver only are allowed to access the Kiosk services !!!`;
        return res.redirect("/login");
      }
    } catch (err) {
      console.log(err);
      res.send(err);
    }
  };

  // Logout Route
  static logout_get = (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        throw err;
      } else {
        res.redirect("/signup");
      }
    });
  };

 


  // Dashboard Get
  static dashboard_get = (req, res) => {

    const myMsg = req.session.msg

    delete req.session.msg

    res.render("dashboard.ejs",{myMsg, navbar: req.session.isValid ? "user_authenticated" : "user_unauthenticated"});
  };

  // G2 Get
  static G2_get = (req, res) => {
    res.render("G2.ejs", { message: "", navbar: req.session.isValid ? "user_authenticated" : "user_unauthenticated" });
  };


  

static G2_post = async (req, res) => {
  try {
    // Extract form data from the request body
    const form_data = req.body;

    // Hash the license number for security
    const hashedLicenseNo = await bcrypt.hash(form_data.licenseNo, 12);

    // Retrieve logged-in user's information from the session
    const loggedInUser = req.session.user;


    driverModel.firstName = form_data.firstName;
    driverModel.lastName = form_data.lastName;
    driverModel.age = form_data.age;
    driverModel.username = loggedInUser.username;
    driverModel.userType = loggedInUser.userType;
    

    // Create a new driver model instance with the form data and user information
    const newDriver = new driverModel({
      firstName: form_data.firstName,
      lastName: form_data.lastName,
      licenseNo: hashedLicenseNo,
      age: form_data.age,
      username: loggedInUser.username, // Set the username to the logged-in user's username
      password: loggedInUser.password, // Set the password to the logged-in user's password
      userType: loggedInUser.userType, // Set the userType to the logged-in user's userType
      car_details: {
        make: form_data.make,
        model: form_data.model,
        year: form_data.year,
        platno: form_data.platno,
      },
    });

    // Save the new driver to the database
    const savedDriver = await newDriver.save();

    req.session.savedDriver = savedDriver;

    console.log(savedDriver);



    // Redirect to another page or send a response
    res.redirect("/G"); // Redirect to the G page
  } catch (error) {
    // Handle errors
    console.error("Error occurred while saving driver data:", error);
    //res.status(500).send("Internal Server Error"); // You can customize the error response as needed
  }
};



  
  // G Get
  
static G_get = async (req, res) => {
  try {
    // Ensure user is logged in
    if (!req.session.user) {
      throw new Error("User not logged in");
    }

    // Get the username of the currently logged-in user from the session
    const loggedInUsername = req.session.savedDriver.username;

    // Fetch the driver data for the currently logged-in user from the database
    const currentUser = await driverModel.findOne({ username: loggedInUsername });
    
    console.log("Driver Data from DB:")
    console.log(currentUser)

    // Check if user data exists
    if (!currentUser) {
      throw new Error("User data not found");
    }



    // Pass the fetched data to the rendering of the G page
    res.render("G.ejs", { currentUser, navbar: req.session.isValid ? "user_authenticated" : "user_unauthenticated" });
  } catch (error) {
    console.error("Error occurred while fetching user data:", error);
    // res.status(500).render("error.ejs", { message: "Internal Server Error" }); // Render error page
  }
};





  // Search the driver info using the license No.

  // G post
  static G_post = async (req, res) => {
    try {
      const data = req.body;

      const search_licenseNo = data.licenseNo;

      const driver_from_db = await driver.findOne({
        licenseNo: search_licenseNo,
      });

      res.render("edit.ejs", { driver: driver_from_db });
    } catch (err) {
      // res.render('datanotfound.ejs')
      console.log(
        `Driver data not found in Database due to the error below. \n ${err}`
      );
      res.send(err);
    }
  };

  // Edit get
  static edit_get = async (req, res) => {
    try {
      const d_licenseNo = req.params.driver_licenseNo;
      const driver_from_db = await driver.findOne({ licenseNo: d_licenseNo });
      res.render("edit.ejs", { driver: driver_from_db });
    } catch (err) {
      console.log(err);
      res.send(err);
    }
  };

  // Edit post
  // Edit post
static edit_post = async (req, res) => {
  try {
    const licenseNo_to_find_and_Update = req.params.driver_licenseNo;
    const driver_edited = req.body;

    console.log(driver_edited);

    // Check if the required properties exist in driver_edited
    if (
      !driver_edited.make ||
      !driver_edited.model ||
      !driver_edited.year ||
      !driver_edited.platno
    ) {
      throw new Error("Missing or invalid driver details");
    }

    const driver_updated_in_db = await driver.findOneAndUpdate(
      { licenseNo: licenseNo_to_find_and_Update },
      {
        firstName: driver_edited.firstName,
        lastName: driver_edited.lastName,
        licenseNo: driver_edited.licenseNo,
        age: driver_edited.age,
        car_details: {
          make: driver_edited.make,
          model: driver_edited.model,
          year: driver_edited.year,
          platno: driver_edited.platno,
        },
      },
      {
        new: true,
      }
    );

    console.log("======= ********* ========= **********");
    console.log(driver_updated_in_db);
    console.log("======= ********* ========= **********");

    res.render("updated_data.ejs", { driver: driver_updated_in_db });
  } catch (err) {
    console.log(`Driver Data not updated in DB \n ${err}`);
    res.send(err);
  }
};

}

export default Controller;
