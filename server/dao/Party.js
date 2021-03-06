/*
  Requêtes vers la bdd pour tout ce qui concerne les soirées
*/

const database = require("../database/Database.js");

const mysql = database.mysql;
const connection = database.connection;

// Création d'une soirée
function createParty(req, callback) {
  let party = req.body;
  let insertIntoParty =
    "insert into party values (null, " +
    party.idAccount +
    ', 1, "' +
    party.name +
    '", "' +
    party.date +
    " " +
    party.time +
    '", ' +
    party.price +
    ", " +
    party.nbAddress +
    ', "' +
    party.street +
    '", "' +
    party.city +
    '", "' +
    party.postCode +
    '", "' +
    party.country +
    '", ' +
    party.guest +
    ', "' +
    party.dataImage +
    '", "' +
    party.description +
    '", ' +
    party.isPartyPro +
    ")";
  connection.query(insertIntoParty, function (err, result, fields) {
    if (err) {
      console.log(err);
      callback(err.sqlMessage, null);
    } else {
      callback(null, { hey: "gg" });
    }
  });
}

// Récupérations des soirées avec ou sans filtres
function getParties(req, callback) {
  let filterStatus = "";
  let account = req.body.account;
  if (req.body.isPartyPro == 1) {
    filterStatus = "and z.isPartyPro = 1 ";
  } else if (req.body.isPartyPro == 0) {
    filterStatus = "and z.isPartyPro = 0 ";
  }

  let filterPrice = "";
  filterPrice = " and z.price <= " + req.body.price;

  let filterDate = "";
  if (req.body.date != null && req.body.date !== "") {
    filterDate1 = ' DATE_FORMAT(party_date, "%Y-%m-%d")';
    filterDate2 = " and '" + req.body.date + "' = ";
    filterDate = filterDate2.concat(filterDate1);
  }

  let getAllParties =
    "SELECT * FROM ( " +
    'SELECT p.*,(p.nb_guests - IFNULL(sum(r.nb_places),0)) as "guests_left", DATE_FORMAT(p.party_date, "%d/%m/%Y") as "date", pa.firstname FROM party p inner join account a on p.id_account = a.id_account left outer join reservation r on p.id_party = r.id_party inner join particular pa on a.id_account = pa.id_account WHERE p.id_status = 1 AND p.party_date >= CURDATE() ' +
    "group by p.id_party " +
    "UNION " +
    'SELECT p.*,(p.nb_guests - IFNULL(sum(r.nb_places),0)) as "guests_left", DATE_FORMAT(p.party_date, "%d/%m/%Y") as "date", pr.name FROM party p inner join account a on p.id_account = a.id_account left outer join reservation r on p.id_party = r.id_party inner join professional pr on a.id_account = pr.id_account WHERE p.id_status = 1 AND p.party_date >= CURDATE() ' +
    "group by p.id_party " +
    ") z " +
    "WHERE 1 " +
    "and z.guests_left > 0 " +
    "and z.id_account <> " +
    account +
    " " +
    "and " +
    account +
    " not in (select r.id_account from reservation r where r.id_party = z.id_party) " +
    filterStatus +
    filterPrice +
    filterDate;

  connection.query(getAllParties, function (err, result, fields) {
    if (err) {
      console.log(err);
      callback(err.sqlMessage, null);
    } else {
      callback(result);
    }
  });
}

// Récupération du type d'une soirée
function getPartyType(req, callback) {
  let getPartyType =
    "SELECT isPartyPro from party where id_party = " + req.body.partyId;
  connection.query(getPartyType, function (err, result) {
    if (err) {
      console.log(err);
      callback(err.sqlMessage, null);
    } else {
      callback(null, result);
    }
  });
}

// Récupération des soirées pro
function getPartyPro(req, callback) {
  let getParty =
    'SELECT p.*, DATE_FORMAT(p.party_date, "%d/%m/%Y") as "date", pr.name as "owner", (p.nb_guests - IFNULL(sum(r.nb_places),0)) as "guests_left" FROM party p inner join account a on p.id_account = a.id_account left outer join reservation r on p.id_party = r.id_party inner join professional pr on a.id_account = pr.id_account WHERE p.id_party = ' +
    req.body.partyId;

  connection.query(getParty, function (err, result) {
    if (err) {
      console.log(err);
      callback(err.sqlMessage, null);
    } else {
      callback(null, result);
    }
  });
}

// Récupération des soirées particulier
function getPartyPart(req, callback) {
  let getParty =
    'SELECT p.*, DATE_FORMAT(p.party_date, "%d/%m/%Y") as "date", pa.firstname as "owner", (p.nb_guests - IFNULL(sum(r.nb_places),0)) as "guests_left" FROM party p inner join account a on p.id_account = a.id_account  left outer join reservation r on p.id_party = r.id_party inner join particular pa on a.id_account = pa.id_account WHERE p.id_party = ' +
    req.body.partyId;

  connection.query(getParty, function (err, result) {
    if (err) {
      console.log(err);
      callback(err.sqlMessage, null);
    } else {
      callback(null, result);
    }
  });
}

// Réservation d'une soirée
function bookParty(req, callback) {
  let bookParty =
    "insert into reservation values (" +
    req.body.account +
    "," +
    req.body.party +
    "," +
    req.body.places +
    ")";

  connection.query(bookParty, function (err, result) {
    if (err) {
      console.log(err);
      callback(err.sqlMessage, null);
    } else {
      callback(null, { result: "success" });
    }
  });
}

// Récupération des soirées qui arrivent
function getPartiesInc(req, callback) {
  let getPartyInc =
    "SELECT * FROM party " +
    "WHERE party.id_party IN " +
    "(SELECT reservation.id_party FROM reservation " +
    "WHERE reservation.id_account = " +
    mysql.escape(req.body.id_account) +
    ") " +
    "AND party.id_status != 3 " +
    "AND party.party_date > SYSDATE()";
  connection.query(getPartyInc, function (err, result) {
    if (err) {
      console.log(err);
      callback(err.sqlMessage, null);
    } else {
      callback(null, result);
    }
  });
}

// Annulation d'une soirée
function cancelParty(req, callback) {
  let cancelParty =
    "DELETE FROM reservation " +
    "WHERE reservation.id_party = " +
    mysql.escape(req.body.id_party) +
    " " +
    "AND reservation.id_account = " +
    mysql.escape(req.body.id_account);
  connection.query(cancelParty, function (err, result) {
    if (err) {
      console.log(err);
      callback(err.sqlMessage, null);
    } else {
      callback(null, result);
    }
  });
}

// Récupération des soirées que l'utilisateur a créé
function getPartiesOwn(req, callback) {
  let getPartiesOwn =
    "SELECT * FROM party " +
    "WHERE party.id_account = " +
    mysql.escape(req.body.id_account) +
    " " +
    "AND party.id_status != 3 " +
    "AND party.party_date > SYSDATE()";
  connection.query(getPartiesOwn, function (err, result) {
    if (err) {
      console.log(err);
      callback(err.sqlMessage, null);
    } else {
      callback(null, result);
    }
  });
}

// Suppression d'une soirée
function deleteParty(req, callback) {
  let deleteParty =
    "UPDATE party SET id_status = 3 " +
    "WHERE party.id_party = " +
    mysql.escape(req.body.id_party);
  connection.query(deleteParty, function (err, result) {
    if (err) {
      console.log(err);
      callback(err.sqlMessage, null);
    } else {
      callback(null, result);
    }
  });
}

// Récupération des soirées terminées auquelles l'utilisateur a participé
function getPartiesEnd(req, callback) {
  let getPartyInc =
    "SELECT * FROM party " +
    "WHERE party.id_party IN " +
    "(SELECT reservation.id_party FROM reservation " +
    "WHERE reservation.id_account = " +
    mysql.escape(req.body.id_account) +
    ") " +
    "AND party.id_status != 3 " +
    "AND party.party_date <= SYSDATE()";
  connection.query(getPartyInc, function (err, result) {
    if (err) {
      console.log(err);
      callback(err.sqlMessage, null);
    } else {
      callback(null, result);
    }
  });
}

// Noter une soirée
function setPartyMark(req, callback) {
  let setPartyMark =
    "INSERT INTO mark " + "(id_account, id_party, mark, description) VALUES ?";
  let value = [
    [
      req.body.id_account,
      req.body.id_party,
      req.body.mark,
      req.body.description,
    ],
  ];

  connection.query(setPartyMark, [value], function (err, result) {
    if (err) {
      console.log(err);
      callback(err.sqlMessage, null);
    } else {
      callback(null, result);
    }
  });
}

// Récupération la note à une soirée si l'utilisateur en a déjà mise une
function getUserMark(req, callback) {
  let getUserMark =
    "SELECT * FROM mark " +
    "WHERE mark.id_account = " +
    mysql.escape(req.body.id_account) +
    " " +
    "AND mark.id_party = " +
    mysql.escape(req.body.id_party);
  connection.query(getUserMark, function (err, result) {
    if (err) {
      console.log(err);
      callback(err.sqlMessage, null);
    } else {
      callback(null, result);
    }
  });
}

// Compte le nombre de soirées qui arrivent
function getCountParties(req, callback) {
  let countParties = null;

  if (req.body.isPart) {
    countParties =
      'SELECT COUNT(*) as "count" FROM ' +
      "( SELECT * FROM party " +
      "WHERE party.id_party IN " +
      "(SELECT reservation.id_party FROM reservation " +
      "WHERE reservation.id_account = " +
      mysql.escape(req.body.id_account) +
      ") " +
      "AND party.id_status != 3 " +
      "AND party.party_date > SYSDATE() ) as subquery";
  } else {
    countParties =
      'SELECT COUNT(*) as "count" FROM ' +
      "( SELECT * FROM party " +
      "WHERE party.id_account = " +
      mysql.escape(req.body.id_account) +
      " " +
      "AND party.id_status != 3 " +
      "AND party.party_date > SYSDATE() ) as subquery";
  }

  connection.query(countParties, function (err, result) {
    if (err) {
      console.log(err);
      callback(err.sqlMessage, null);
    } else {
      callback(null, result);
    }
  });
}

// Récupération de toutes les notes pour une soirée
function getReview(req, callback) {
  let getReview =
    'SELECT mark.id_mark, mark.id_account, mark.mark, mark.description, particular.firstname as "name" FROM mark, particular, account ' +
    "WHERE mark.id_party = " +
    mysql.escape(req.body.id_party) +
    " " +
    "AND mark.id_account = account.id_account " +
    "AND account.id_account_type = 1 " +
    "AND account.id_account = particular.id_account " +
    "AND account.id_account = mark.id_account " +
    "UNION " +
    'SELECT mark.id_mark, mark.id_account, mark.mark, mark.description, CONCAT(professional.name, " (pro)") as "name" FROM mark, professional, account ' +
    "WHERE mark.id_party = " +
    mysql.escape(req.body.id_party) +
    " " +
    "AND mark.id_account = account.id_account " +
    "AND account.id_account_type = 2 " +
    "AND account.id_account = professional.id_account " +
    "AND account.id_account = mark.id_account " +
    "ORDER BY id_mark ASC";

  connection.query(getReview, function (err, result) {
    if (err) {
      console.log(err);
      callback(err.sqlMessage, null);
    } else {
      callback(null, result);
    }
  });
}

module.exports = {
  createParty,
  getParties,
  getPartyType,
  getPartyPro,
  getPartyPart,
  bookParty,
  getPartiesInc,
  deleteParty,
  getPartiesOwn,
  cancelParty,
  getPartiesEnd,
  setPartyMark,
  getUserMark,
  getCountParties,
  getReview,
};
