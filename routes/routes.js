import Controller from "../controllers/controller.js";

import express from 'express'

import isValidUser from "../middlewares/validate.js";

const router = express.Router()

router.get('/login',Controller.login_get)

router.post('/login',Controller.login_post)

router.get('/signup',Controller.signup_get)

router.post('/signup',Controller.signup_post)

router.get('/logout',Controller.logout_get)

router.get('/dashboard',isValidUser,Controller.dashboard_get)

router.get('/G2',isValidUser,Controller.G2_get)

router.post('/G2',Controller.G2_post)

router.get('/G',isValidUser,Controller.G_get)

router.post('/G',Controller.G_post)

router.get('/edit',isValidUser,Controller.edit_get)

router.post('/edit',Controller.edit_post)





export default router