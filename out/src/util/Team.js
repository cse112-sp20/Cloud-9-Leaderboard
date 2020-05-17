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
Object.defineProperty(exports, "__esModule", { value: true });
exports.createAndJoinTeam = void 0;
const vscode_1 = require("vscode");
const Firestore_1 = require("./Firestore");
function createAndJoinTeam() {
    return __awaiter(this, void 0, void 0, function* () {
        const newTeamName = yield vscode_1.window
            .showInputBox({ placeHolder: "Enter a new team name" })
            .then((input) => {
            if (input === undefined)
                return;
            // //check if already in database
            // var teamDoc = db.collection('teams').doc(input);
            // teamDoc.get().then((doc) =>{
            // 	if(doc.exists){
            // 		console.log("Name already in use!");
            // 	}else{
            // 		db.collection('teams').set(input)
            // 	}
            // });
            Firestore_1.addNewTeamToDb(input);
        });
    });
}
exports.createAndJoinTeam = createAndJoinTeam;
//# sourceMappingURL=Team.js.map