const express = require("express");
const cors = require('cors');
const con = require('./database');


const app = express();
app.use(express.json());
app.use(cors());

con.connect((err) => {
    if(err){
        console.log("Connection failed: " + err.message);
    }
    else {
        console.log("Connected to MySQL successfully!");
    }
})

app.get("/", (req, res) => {
    const sql = "SELECT * FROM account";
    con.query(sql, async (err, data) => {
        if(err) return res.json("ERROR");

        return res.json(data);
    })
})

app.post("/validation", (req, res) => {
    const sql = "SELECT * FROM account WHERE username=? AND password=?";
    
    con.query(sql, [req.body.username, req.body.password], (err, data) => {
        if (err) return res.json("err");

        if(data.length > 0){
            return res.json(data);
        }
        else{
            return res.json([{'type': 'no record'}]);
        }
    })
})

app.get("/category", (req, res) => {
    const sql = "SELECT * FROM category";
    con.query(sql, (err, data) => {
        return res.json(data);
    })
})

app.get("/sub_category", (req, res) => {
    const sql = "SELECT * FROM sub_category";
    
    con.query(sql, (err, data) => {
        if (err) return res.json(err);
        return res.json(data);
    })
})

app.post("/find_username", (req, res) => {
    const sql = "SELECT * FROM account WHERE username=?";

    con.query(sql, [req.body.username], (err, data) => {
        if (err) return res.json(err);

        if (data.length > 0){
            return res.json([{'isFound' : 'yes'}]);
        }
        else{
            return res.json([{'isFound' : 'no'}]);
        }
    })
})

app.post("/create_account", (req, res) => {
    const sql = "INSERT INTO `account`(`username`, `password`, `type`) VALUES (?,?,?)";
    const sql1 = "INSERT INTO `user`(`username`, `name`, `role`) VALUES (?,?,?)";
    
    con.query(sql, [req.body.username, req.body.password, 'staff'], (err, data) => {
        if (err) return res.json(err);

        con.query(sql1, [req.body.username, 'Null', 'staff'], (err, data) => {
            if (err) return res.json(err);
            return res.json([{'status': 'Registration Complete'}])
        })

    })
})

app.post("/is_password_correct", (req, res) => {
    const sql = "SELECT * FROM account WHERE username=? AND password=?";

    con.query(sql, [req.body.username, req.body.password], (err, data) => {
        if (err) return res.json(err);
        
        if(data.length > 0) {
            return res.json(data);
        } else {
            return res.json('incorrect');
        }
    })
})

app.post('/get_user', (req, res) => {
    const sql = "SELECT u.user_id, u.username, u.name, u.role, a.password FROM `user` u JOIN account a ON a.username = u.username WHERE u.username=?";

    con.query(sql, [req.body.userToken], (err, data) => {
        if (err) return res.json(err);
        return res.json(data);
    })
})

app.post('/update_name', (req, res) => {
    const sql = "UPDATE `user` SET `name`=? WHERE username=?";
    con.query(sql, [req.body.name, req.body.userToken], (err, data) =>{
        if (err) return res.json(err);
    })
})

app.post('/update_username', (req, res) => {
    const sql = "UPDATE `user` SET `username`=? WHERE username=?";
    const sql1 = "UPDATE `account` SET `username`=? WHERE username=?";
    con.query(sql, [req.body.username, req.body.userToken], (err, data) =>{
        if (err) return res.json(err);
        
        con.query(sql1, [req.body.username, req.body.userToken], (err, data) => {
            if(err) return res.json(err);
            return res.json([{'status': 'oki'}])
        })
    })
})

app.post('/change_password', (req, res) => {
    const sql = "UPDATE `account` SET `password`=? WHERE username=?";

    con.query(sql, [req.body.password, req.body.userToken], (err, data) => {
        if(err) return res.json(err);
        return res.json([{'status': 'oki'}])
    })
})

app.post("/get_tasks", (req, res) => {
    const sql = "SELECT * FROM `problem` WHERE cat_id=? AND scat_id=? ORDER BY status DESC, date_created DESC";

    con.query(sql, [req.body.category, req.body.subCategory], (err, data) => {
        if (err) return res.json(err);
        return res.json(data);
    })
})

app.post('/get_category', (req, res) => {
    const sql = "SELECT * FROM `category` WHERE cat_id=?";
    con.query(sql, [req.body.category], (err, data) => {
        if(err) return res.json(err);
        return res.json(data);
    })
})

app.post('/get_subcat', (req, res) => {
    const sql = "SELECT * FROM `sub_category` WHERE scat_id=? ";
    con.query(sql, [req.body.subCategory], (err, data) => {
        if(err) return res.json(err);
        return res.json(data);
    })
})

app.post('/get_problem_details', (req, res) => {
    const sql = "SELECT * FROM problem WHERE prob_no=?";
    con.query(sql, [req.body.prob_no], (err, data) => {
        if(err) return res.json(err);
        
        return data.length > 0 ? res.json(data) : res.json([{'status': 'no found'}])
    })
})

app.post('/update_problem', (req, res) => {
    const sql = "UPDATE `problem` SET `cat_id`=?,`scat_id`=?,`prob_name`=?,`description`=? WHERE prob_no=?";
    con.query(sql, [req.body.currentCategory, req.body.currentSubCategory, req.body.probName, req.body.desc, req.body.probNo], (err, data) => {
        if(err) return res.json(err);
        return res.json([{'status': 'oki'}])
    })
})

app.post('/delete_prob', (req, res) => {
    const sql = "DELETE FROM `problem` WHERE prob_no=?";

    con.query(sql, [req.body.prob_no], (err, data) => {
        if(err) return res.json(err);
        return res.json([{'status': 'oki'}])
    })
})

app.post('/add_task', (req, res) => {
    const sql = "INSERT INTO `problem`(`cat_id`, `scat_id`, `prob_name`, `description`, `status`, `date_created`, `author`) VALUES (?,?,?,?,?,?,?)";

    con.query(sql, [req.body.selectedCategory, req.body.selectedSubCategory, req.body.tempTitle, req.body.desc, 'Pending', req.body.date_created, req.body.userToken], (err, data) => {
        if(err) return res.json(err);
        return res.json([{'status': 'oki'}])
    })
})

app.post('/take_task', (req, res) => {
    const sql = "UPDATE `problem` SET `solved_by`=?, `status`=?,`progress_started`=?,`taken_by`=? WHERE prob_no=?";

    con.query(sql, [null, 'In Progress', req.body.progStart, req.body.user, req.body.prob_no], (err, data) => {
        if(err) return res.json(err);
        return res.json([{'status': 'oki'}])
    })
})

app.post('/cancel_task', (req, res) => {
    const sql = "UPDATE `problem` SET `status`=?,`progress_started`=?,`taken_by`=? WHERE prob_no=?";

    con.query(sql, ['Pending', null, '', req.body.prob_no], (err, data) => {
        if(err) return res.json(err);
        return res.json([{'status': 'oki'}])
    })
})

app.post('/finish_task', (req, res) => {
    const sql = "UPDATE `problem` SET `status`=?,`finished`=?,`solved_by`=? WHERE prob_no=?";

    con.query(sql, ['Finished', req.body.finished, req.body.userToken, req.body.prob_no], (err, data) => {
        if(err) return res.json(err);
        return res.json([{'status': 'oki'}])
    })
})

app.post('/total_task_done', (req, res) => {
    const sql = "SELECT COUNT(*) total FROM `problem` WHERE solved_by=?";

    con.query(sql, [req.body.userToken], (err, data) => {
        if(err) return res.json(err);
        return res.json(data)
    })
})

app.post('/total_task_done_today', (req, res) => {
    const sql = "SELECT COUNT(*) total FROM `problem` WHERE solved_by=? AND finished LIKE ?";

    con.query(sql, [req.body.userToken, req.body.finished], (err, data) => {
        if(err) return res.json(err);
        return res.json(data)
    })
})

app.post('/get_table_details', (req, res) => {
    const sql = "SELECT p.prob_no, c.category cat_id, s.sub_category scat_id, p.prob_name, p.description, p.status, p.date_created, p.progress_started, p.finished, p.solved_by, p.author, p.taken_by FROM `problem` p LEFT JOIN category c ON p.cat_id=c.cat_id LEFT JOIN sub_category s ON p.scat_id=s.scat_id WHERE status=? ORDER BY prob_no ASC";

    con.query(sql, [req.body.table], (err, data) => {
        if(err) return res.json(err);
        return res.json(data)
    })
})

app.get('/get_staff', (req, res) => {
    const sql = "SELECT * FROM `account` WHERE type='staff'";

    con.query(sql, (err, data) => {
        if(err) return res.json(err);
        return res.json(data)
    })
})

app.get('/get_creation_dates', (req, res) => {
    const sql = "SELECT DISTINCT(date_created) FROM `problem`";

    con.query(sql, (err, data) => {
        if(err) return res.json(err);
        return res.json(data)
    })
})

app.get('/get_finish_dates', (req, res) => {
    const sql = "SELECT DISTINCT(finished) FROM `problem` WHERE finished IS NOT NULL";

    con.query(sql, (err, data) => {
        if(err) return res.json(err);
        return res.json(data)
    })
})

app.get('/get_progress_started', (req, res) => {
    const sql = "SELECT DISTINCT(progress_started) FROM `problem` WHERE progress_started IS NOT NULL";

    con.query(sql, (err, data) => {
        if(err) return res.json(err);
        return res.json(data)
    })
})

app.post('/filter_table', (req, res) => {
    const sql = "SELECT p.prob_no, c.category cat_id, s.sub_category scat_id, p.prob_name, p.description, p.status, p.date_created, p.progress_started, p.finished, p.solved_by, p.author, p.taken_by FROM `problem` p LEFT JOIN category c ON p.cat_id=c.cat_id LEFT JOIN sub_category s ON p.scat_id=s.scat_id WHERE status=?" + req.body.addedQuery;

    con.query(sql, [req.body.table], (err, data) => {
        if(err) return res.json(err);
        return res.json(data)
    })
})

app.post('/get_prob_info', (req, res) => {
    const sql = "SELECT p.prob_no, c.category cat_id, s.sub_category scat_id, p.prob_name, p.description, p.status, p.date_created, p.progress_started, p.finished, p.solved_by, p.author, p.taken_by FROM `problem` p LEFT JOIN category c ON p.cat_id=c.cat_id LEFT JOIN sub_category s ON p.scat_id=s.scat_id WHERE prob_no=?";

    con.query(sql, [req.body.probNo], (err, data) => {
        if(err) return res.json(err);
        return res.json(data)
    })
})

app.get("/get_pendings", (req, res) => {
    const sql = "SELECT prob_name FROM `problem` WHERE status='Pending'";
    con.query(sql, (err, data) => {
        return res.json(data);
    })
})

app.post("/get_current", (req, res) => {
    const sql = "SELECT prob_name, description FROM `problem` WHERE status='In Progress' AND taken_by=?";
    con.query(sql,[req.body.userToken], (err, data) => {
        return res.json(data);
    })
})

app.post("/search_title", (req, res) => {
    const sql = "SELECT c.category cat_id, s.sub_category scat_id, p.prob_name FROM `problem` p LEFT JOIN category c ON p.cat_id=c.cat_id LEFT JOIN sub_category s ON p.scat_id=s.scat_id WHERE prob_name LIKE ?";
    con.query(sql,[req.body.searchTitle], (err, data) => {
        if(err) return res.json(err);
        return res.json(data);
    })
})

app.get('/get_finished', (req, res) => {
    const sql = "SELECT * FROM `problem` WHERE status='Finished'";

    con.query(sql, (err, data) => {
        if(err) return res.json(err);
        return res.json(data)
    })
})

app.get('/get_inprogress', (req, res) => {
    const sql = "SELECT * FROM `problem` WHERE status='In Progress'";

    con.query(sql, (err, data) => {
        if(err) return res.json(err);
        return res.json(data)
    })
})

app.listen("5000", () => {
    console.log("Listening...");
})