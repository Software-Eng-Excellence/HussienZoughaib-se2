"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const logger_1 = __importDefault(require("./util/logger"));
const Order_mapper_1 = require("./mappers/Order.mapper");
const xmlParser_1 = require("./util/xmlParser");
const Toy_mapper_1 = require("./mappers/Toy.mapper"); // fixed relative import
const jsonParser_1 = require("./util/jsonParser");
const Book_mapper_1 = require("./mappers/Book.mapper");
const CakeOrder_Rep_1 = require("./repository/file/CakeOrder.Rep");
const config_1 = __importDefault(require("./config"));
const Orderrepo_1 = require("./repository/sqlite/Orderrepo");
const CakeOrder_Repo_1 = require("./repository/sqlite/CakeOrder.Repo");
const Cake_builder_1 = require("./models/builder/Cake.builder");
const Order_builder_1 = require("./models/builder/Order.builder");
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            ;
            const data = new CakeOrder_Rep_1.CakeOrderRep(config_1.default.Storage.CSV.cake);
            const list_ordres = yield data.get("1");
            logger_1.default.info("Cakes order successfully:");
            logger_1.default.info('list of cakes:\n %o', list_ordres); // fixed newline
            // for toys: parseXml returns an object, normalize to array and convert each row -> string[]
        }
        catch (error) {
            logger_1.default.error(error);
        }
    });
}
function main_2() {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        try {
            const xmldata = yield (0, xmlParser_1.parseXml)("src/data/toy orders.xml");
            const rawRows = (_a = xmldata === null || xmldata === void 0 ? void 0 : xmldata.data) === null || _a === void 0 ? void 0 : _a.row;
            const rows = rawRows ? (Array.isArray(rawRows) ? rawRows : [rawRows]) : [];
            const toyMapper = new Toy_mapper_1.ToyMapper();
            const order_2 = new Order_mapper_1.CSVOrderMapper(toyMapper);
            const rowToStringArray = (row) => {
                if (!row)
                    return [];
                if (Array.isArray(row))
                    return row.map(v => String(v !== null && v !== void 0 ? v : ''));
                // Fast-XML-Parser often uses { '#text': 'value' } shapes; prefer '#text' or primitive values
                return Object.keys(row).map(k => {
                    var _a, _b;
                    const v = row[k];
                    if (v == null)
                        return '';
                    if (typeof v === 'object')
                        return String((_b = (_a = v['#text']) !== null && _a !== void 0 ? _a : v['@_']) !== null && _b !== void 0 ? _b : '');
                    return String(v);
                });
            };
            const list_ordres_2 = rows.map(r => order_2.map(rowToStringArray(r)));
            logger_1.default.info("toys order successfully:");
            logger_1.default.info('list of toys:\n %o', list_ordres_2);
        }
        catch (error) {
            logger_1.default.error(error);
        }
    });
}
function main_3() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const bookdata = yield (0, jsonParser_1.parseJSON)("src/data/book orders.json");
            const bookmappper = new Book_mapper_1.BookMapper();
            const order_3 = new Order_mapper_1.CSVOrderMapper(bookmappper);
            const list_ordres_3 = bookdata.map(r => order_3.map(Object.values(r).map(v => String(v !== null && v !== void 0 ? v : ''))));
            logger_1.default.info("books order successfully:");
            logger_1.default.info('list of books:\n %o', list_ordres_3);
        }
        catch (error) {
            logger_1.default.error(error);
        }
    });
}
function DBsandbox() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const order_Repo = new Orderrepo_1.Orderrepo(new CakeOrder_Repo_1.CakeOrderRepo());
            yield order_Repo.init();
            const cake = Cake_builder_1.CakeBuilder.createBuilder()
                .setType("Birthday")
                .setFlavor("Chocolate")
                .setFilling("Cream")
                .setSize(8)
                .setLayer(2)
                .setFrostingType("Buttercream")
                .setFrostingFlavor("Vanilla")
                .setDecType("Sprinkles")
                .setDecColor("Rainbow")
                .setCustomMessage("Happy Birthday!")
                .setShape("Round")
                .setAllergies("Nut-Free") // required by builder
                .setSpIng("Organic Ingredients") // required by builder (spIng)
                .setPackageType("Standard Box") // required by builder
                .build();
            const indentCake = Cake_builder_1.IndentCakeBuilder.createBuilder()
                .setId("cake-001")
                .setCake(cake)
                .build();
            ;
            ;
            const order1 = Order_builder_1.OrderBuilder.createBuilder().setPrice(29.99).setItem(cake).setQuantity(2).setId("124").build();
            const identforde1r = Order_builder_1.IdentfOrderBuilder.createBuilder().setOrder(order1).setItem(indentCake).build();
            const id = yield order_Repo.create(identforde1r);
            logger_1.default.info("Order created successfully");
            console.log(yield order_Repo.get(id));
        }
        catch (error) {
            logger_1.default.error(error);
        }
    });
}
DBsandbox().catch((error) => logger_1.default.error(error));
//main();
//main_2();
//main_3();
//# sourceMappingURL=index.js.map