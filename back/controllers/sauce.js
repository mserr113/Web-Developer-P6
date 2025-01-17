const Sauce = require('../models/sauce');
const fs = require('fs');
const sauce = require('../models/sauce');
const { restart } = require('nodemon');

exports.createSauce = (req, res, next) => {
    req.body.sauce = JSON.parse(req.body.sauce);  
    const url = req.protocol  + '://' + req.get('host');  
    const sauce = new Sauce({
        userId: req.body.sauce.userId,
        name: req.body.sauce.name,
        manufacturer: req.body.sauce.manufacturer,
        description: req.body.sauce.description,
        mainPepper: req.body.sauce.mainPepper,
        imageUrl: url + '/images/' + req.file.filename,
        heat: req.body.sauce.heat,
        likes: 0,
        dislikes: 0,
        usersLiked: [],
        usersDisliked: [],
    });
    sauce.save().then(
        () => {
            res.status(201).json({
                message: 'Sauce saved successfully!'
            })
        }
    ).catch(
        (error) => {
            res.status(400).json({
                error: error
            });
        }
    );
};

exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({_id: req.params.id}).then(
      (sauce) => {
        res.status(200).json(sauce);
      }
    ).catch(
      (error) => {
        res.status(404).json({
          error: error
        });
      }
    );
  };

exports.modifySauce = (req, res, next) => {
    let sauce = new Sauce({_id: req.params.id });
    if(req.file) {
      req.body.sauce = JSON.parse(req.body.sauce);  
      const url = req.protocol  + '://' + req.get('host');  
      sauce = {
        _id: req.params.id,
        userId: req.body.sauce.userId,
        name: req.body.sauce.name,
        manufacturer: req.body.sauce.manufacturer,
        description: req.body.sauce.description,
        mainPepper: req.body.sauce.mainPepper,
        imageUrl: url + '/images/' + req.file.filename,
        heat: req.body.sauce.heat,
        likes: 0,
        dislikes: 0,
        usersLiked: [],
        usersDisliked: [],
    };
    } else {
        sauce = {
        _id: req.params.id,
        name: req.body.name,
        manufacturer: req.body.manufacturer,
        description: req.body.description,
        heat: req.body.heat,
        //need to maintain likes and dislikes
        likes: req.body.likes,
        dislikes: req.body.dislikes,
        imageUrl: req.body.imageUrl,
        mainPepper: req.body.mainPepper,
        //need to hard set these values to be empty arrays/zeroes
        usersLiked: req.body.usersLiked,
        usersDisliked: req.body.usersDisliked,
        userId: req.body.userId,
      };
    }
    //this needs to  be added at the end of the like/dislike code
    Sauce.updateOne({_id: req.params.id}, sauce).then(
      () => {
        res.status(201).json({
          message: 'Sauce updated successfully!'
        });
      }
    ).catch(
      (error) => {
        res.status(400).json({
          error: error
        });
      }
    );
  };

exports.likeSauce = (req, res, next) => {
  Sauce.findOne({_id:req.params.id}).then(
    (sauce) => {
      if(!sauce){
        return res.status(404).send({
          message: "this is not a sauce",
          data:{}
        });
      }else{
        const currentUserId = req.body.userId;
        const userLike = req.body.like;
        switch (userLike){
          case 1:
            sauce.usersLiked.push(currentUserId);
            sauce.likes = sauce.usersLiked.length;
            if (sauce.usersDisliked.includes(currentUserId)){
              sauce.usersDisliked = sauce.usersDisliked.filter((id) => {
                return id !== currentUserId;
              })
            sauce.dislikes = sauce.usersDisliked.length;
            }
          break;
          case 0:
            if (sauce.usersDisliked.includes(currentUserId)){
              sauce.usersDisliked = sauce.usersDisliked.filter((id) => {
                return id !== currentUserId;
              })
            sauce.dislikes = sauce.usersDisliked.length;
            }
            if (sauce.usersLiked.includes(currentUserId)){
              sauce.usersLiked = sauce.usersLiked.filter((id) => {
                return id !== currentUserId;
              })
            sauce.likes = sauce.usersLiked.length;
            }
          break
          case -1:
            sauce.usersDisliked.push(currentUserId);
            sauce.dislikes = sauce.usersDisliked.length;
            if (sauce.usersLiked.includes(currentUserId)){
              sauce.usersLiked = sauce.usersLiked.filter((id) => {
                return id !== currentUserId;
              })
            sauce.likes = sauce.usersLiked.length;
            }
          break
        }}
        Sauce.updateOne({_id: req.params.id}, sauce).then(
          () => {
            res.status(201).json({
              message: 'Sauce updated successfully!'
            });
          }
        ).catch(
          (error) => {
            res.status(400).json({
              error: error
            });
          }
        );
      } 
    )};
  // ).catch(
  //   (error) => {
  //     res.status(400).json({
  //       error: error
  //     });
  //   }
  // );
    // if(!sauce)
    //   return res.status(400).json({
    //     message: 'sauce does not exist!'
    //   });
    
  //   $push:{usersLiked:req.body.userId}
  // },{new:true
  // }).exec((err,result)=>{
  //   if(err){
  //     res.status(400).json({
  //       error: error
  //     });
  //   }
  // });
// }

exports.deleteSauce = (req, res, next) => {
  Sauce.findOne({_id: req.params.id}).then(
    (sauce) => {
      const filename = sauce.imageUrl.split('/images/')[1];
      fs.unlink('images/' + filename, () => {
        Sauce.deleteOne({_id: req.params.id}).then(
          () => {
            res.status(200).json({
              message: 'Deleted!'
            });
          }
        ).catch(
          (error) => {
            res.status(400).json({
              error: error
            });
          }
        );
      });
    }
  );
};

exports.getAllSauces = (req, res, next) => {
    Sauce.find().then(
        (sauces) => {
            res.status(200).json(sauces);
        }
    ).catch(
        (error) => {
            res.status(400).json({
                error: error
            });
        }
    )
};