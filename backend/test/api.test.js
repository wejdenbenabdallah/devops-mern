const chai = require("chai");
const chaiHttp = require("chai-http");
const app = require("../../server"); // Assurez-vous que le chemin est correct
const Item = require("../../models/Item"); // Assurez-vous que le chemin est correct

const expect = chai.expect;

chai.use(chaiHttp);

describe("API Tests", () => {
  // Avant chaque test, nettoyez la base de données
  beforeEach(async () => {
    await Item.deleteMany({});
  });

  // Test GET route
  describe("GET /api/items", () => {
    it("should return all items", async () => {
      // Ajouter des éléments à la base de données pour tester la récupération
      const item1 = new Item({ name: "Item 1" });
      await item1.save();
      const item2 = new Item({ name: "Item 2" });
      await item2.save();

      // Faire une requête GET à l'API
      const res = await chai.request(app).get("/api/items");

      // Vérifier la réponse
      expect(res).to.have.status(200);
      expect(res.body).to.be.an("array");
      expect(res.body).to.have.lengthOf(2);
      expect(res.body[0]).to.have.property("name", "Item 1");
      expect(res.body[1]).to.have.property("name", "Item 2");
    });
  });

  // Test POST route
  describe("POST /api/items", () => {
    it("should add a new item", async () => {
      const newItem = { name: "New Item" };

      // Faire une requête POST à l'API pour ajouter un nouvel élément
      const res = await chai.request(app).post("/api/items").send(newItem);

      // Vérifier la réponse
      expect(res).to.have.status(200);
      expect(res.body).to.have.property("name", "New Item");

      // Vérifier si l'élément a été ajouté à la base de données
      const items = await Item.find();
      expect(items).to.be.an("array");
      expect(items).to.have.lengthOf(1);
      expect(items[0]).to.have.property("name", "New Item");
    });
  });
});
