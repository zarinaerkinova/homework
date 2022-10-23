const express = require("express");
const router = express.Router();
const Course = require("../model/course");
const Category = require("../model/category");
const { Types } = require('mongoose')

router.get("/", async function (req, res, next) {
  const courses = await Course.find();
  res.render("courses", {
    title: "Courses",
    name: req.session.admin.name,
    courses,
    admin: req.session.adm
  });
});

router.get('/update/:id', async (req, res) => {
  if (!req.session.adm) {
    res.redirect('/courses')
  }
  const course = await Course.findById(req.params.id)
  const categories = await Category.find();
  res.render('updateCourse', {
    title: course.name,
    image: course.image,
    id: course.id,
    categories,
    name: req.session.admin.name
  })
})

router.post('/update/', async (req, res) => {
  if (!req.session.adm) {
    res.redirect('/courses')
  }
  const { name, image, id, categoryId, price } = req.body
  await Course.findByIdAndUpdate(id, {
    name,
    image,
    categoryId: Types.ObjectId(categoryId),
    price
  })
  res.redirect('/courses')
})

router.get('/remove/:id', async (req, res) => {
  if (!req.session.adm) {
    res.redirect('/courses')
  }
  const id = req.params.id
  await Course.findByIdAndRemove(id)
  res.redirect('/courses')
})

router.get("/course/create", async function (req, res, next) {
  if (!req.session.adm) {
    res.redirect('/courses')
  }
  const categories = await Category.find();

  res.render("addCourse", {
    title: "Add",
    categories,
    name: req.session.admin.name
  });
});

router.post("/course/create", async function (req, res, next) {
  if (!req.session.adm) {
    res.redirect('/courses')
  }
  const { name, image, categoryId, price } = req.body;

  const course = new Course({
    name,
    image,
    categoryId: Types.ObjectId(categoryId),
    price
  });

  await course.save();

  res.redirect("/courses");
});

module.exports = router;