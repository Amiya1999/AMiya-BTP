const cds = require('@sap/cds');
const { MongoClient } = require('mongodb');

const uri = "mongodb+srv://amiyapradhan1995:Sqt2NKOrq2ZI881t@cluster0.qh0qpto.mongodb.net/";
const db_name = "how";
const client = new MongoClient(uri);

async function done(req) {
  await client.connect();
  const db = await client.db(db_name);
  const bill = await db.collection('bill').insertOne(req.data);
  if (bill.insertedId) {
    req.data.id = bill.insertedId;
  }
  return req.data;
}

async function getDocumentWithMaxFields(req) {
  const db = await connectToMongoDB();
  try {
    const bills = await db.collection('bill').find().toArray();

    let maxFields = -1;
    let maxFieldsDocument = {};

    bills.forEach(document => {
      const numFields = Object.keys(document).length;
      if (numFields > maxFields) {
        maxFields = numFields;
        maxFieldsDocument = document;
      }
    });

    return maxFieldsDocument;
  } finally {
    await client.close();
  }
}

async function connectToMongoDB() {
  await client.connect();
  return client.db(db_name);
}

module.exports = cds.service.impl(async function () {
  const { bill, billed } = this.entities;

  // Service implementation for INSERT
  this.on('INSERT', bill, done);

  // Service implementation for READ (retrieve the document with the maximum number of fields)
  this.on('READ', billed, async (req) => {
    const maxFieldsDocument = await getDocumentWithMaxFields(req);
    return [maxFieldsDocument]; // Return as an array, assuming billed is a collection
  });
});
