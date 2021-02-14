const cors = require("cors");
const express = require("express");
//add a stripe key
const stripe = require("stripe")(
  "pk_test_51IJGhbICCrZuzDLrT6NV0pJW4oJqdI3mvvFOsicZv0jHjb36nhreFZywC1hfbiNDIfgJvaRDc4NzLHWBbbRpLN7Z00nCYtruIR"
);
const { v4: uuidv4 } = require("uuid");
uuidv4();

const app = express();

//middleware

app.use(express.json());
app.use(cors());

//routes
app.get("/", (req, res) => {
  res.send("It is working fine...");
});

app.post("/payment", (req, res) => {
  const { product, token } = req.body;
  console.log("product", product);
  console.log("price", product.price);
  const idempontencyKey = uuid();

  return stripe.customers
    .create({
      email: token.email,
      source: token.id,
    })
    .then((customer) => {
      stripe.charges.create(
        {
          amount: product.price * 100,
          currency: "usd",
          customer: customer.id,
          receipt_email: token.email,
          description: `purchase of ${product.name} is succesful!`,
          shipping: {
            name: token.card.name,
            address: {
              country: token.card.adress_country,
            },
          },
        },
        { idempontencyKey }
      );
    })
    .then((result) => res.status(200).json(result))
    .catch((err) => console.log(err));
});
//listen

app.listen(8282, () => {
  console.log("Server running at port 8282");
});
