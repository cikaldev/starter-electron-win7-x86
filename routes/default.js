const { app } = require('electron')
const fs = require('fs')
const path = require('path')
const express = require('express')
const router = express.Router()
const Datastore = require('nedb-promises')

const useTable = (tableName) => {
  const filename = (process.versions.hasOwnProperty('electron'))
    ? path.resolve(process.resourcesPath, 'data/' + tableName)
    : path.resolve(__dirname, '../data/' + tableName)
  const table = new Datastore({ filename: filename });
  return table;
}

router.get('/', (req, res) => {
  res.render('v_page', {
    title: 'Homepage',
    body: '<p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Voluptate consequatur sed dignissimos provident veritatis debitis et temporibus rem, omnis mollitia cumque inventore saepe explicabo neque voluptatibus porro. Debitis repellat, dolorum.</p>'
  });
})

router.get('/about', (req, res) => {
  res.render('v_page', {
    title: 'About page',
    body: '<p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Similique minus aut quam, quas eos repellendus vel maiores soluta ipsa. Fugit sapiente earum iusto praesentium similique minus, voluptatem repellendus doloremque corporis.</p>'
  });
})

router.get('/license', (req, res) => {
  const str_license = fs.readFileSync(path.resolve(__dirname, '../LICENSE'));
  res.render('v_page', {
    title: 'Project License',
    body: `<p><pre>${str_license}</pre></p>`
  });
})

router.get('/read', async (req, res) => {
  const db = await useTable('guest_data');
  await db.find({}).then(data => {
    res.render('v_read', {data: data})
  })
})

router.all('/create', async (req, res) => {
  const db = await useTable('guest_data');
  if (req.method == 'POST') {
    await db.insert(req.body).then(() => {
      res.redirect('/read');
    })
  } else {
    res.render('v_create');
  }
})

router.all('/update/:id', async (req, res) => {
  const db = await useTable('guest_data');
  if (req.method == 'POST') {
    const fm = req.body;
    await db.update({_id: req.params.id}, { $set: {name: fm.name, phone: fm.phone}}).then(() => {
      res.redirect('/read');
    })
  } else {
    await db.findOne({_id: req.params.id}, {}).then((row) => {
      res.render('v_update', {rs: row});
    })
  }
})

router.get('/delete/:id', async (req, res) => {
  const db = await useTable('guest_data');
  await db.remove({_id: req.params.id}, {}).then(() => {
    res.redirect('/read');
  })
})

module.exports = router