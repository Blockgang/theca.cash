// Constants
const ApiURL = "http://localhost:8080/api/v1";
const BitindexApiURL = "https://api.bitindex.network/api/v1/utxos/";
const DatacashRPC = "https://bchsvexplorer.com"
const PrefixTheca = "0xe901"
const PrefixReply = "0x6d03"
const PrefixLike = "0x6d04"
const ImageCommentsTrue = "icons/comment_1.png"
const ImageCommentsFalse = "icons/comment_0.png"
const ImageLikeTrue = "icons/heart_1.png"
const ImageLikeFalse = "icons/heart_0.png"


// Convert a hex string to a byte array
function hexToBytes(hex) {
    for (var bytes = [], c = 0; c < hex.length; c += 2)
    bytes.push(parseInt(hex.substr(c, 2), 16));
    return bytes;
}

// Convert a byte array to a hex string
function bytesToHex(bytes) {
    for (var hex = [], i = 0; i < bytes.length; i++) {
        hex.push((bytes[i] >>> 4).toString(16));
        hex.push((bytes[i] & 0xF).toString(16));
    }
    return hex.join("");
}

function reverseBytes(txid){
  return bytesToHex(hexToBytes(txid).reverse())
}

function send(){ //217 chars
  // var pkey = document.getElementById('pkey').value
  var pkey = localStorage.getItem('pk');
  var title = document.getElementById('title').value
  var type = document.getElementById('data_type').value
  var hash = document.getElementById('hash').value
  var prefix = PrefixTheca
  var payload = [hash,type,title]
  console.log(payload);
  var tx = {
      data: [prefix, hash,type,title],
      cash: {
        key: pkey,
        rpc: DatacashRPC
      }
    }
  datacash.send(tx, function(err, res) {
    console.log(res)
  })
}


function reply(txid){ //comment 184chars
  var comment = document.getElementById(txid + '_comment').value;
  // var pkey = document.getElementById('pkey').value;
  var pkey = localStorage.getItem('pk');
  var commentCounter = document.getElementById("comment_counter_"+txid)
  var commentImg = document.getElementById("comment_"+txid)
  var prefix = PrefixReply
  var reverseByteTxId = "0x"+reverseBytes(txid)
  var tx = {
      data: [prefix, reverseByteTxId,comment],
      cash: {
        key: pkey,
        rpc: DatacashRPC
      }
    }
  console.log(tx)
  datacash.send(tx, function(err, res) {
    if(err != null){
      return false
    }else{
      commentCounter.innerHTML = parseInt(commentCounter.innerHTML) + 1
      commentImg.src = ImageCommentsTrue
      console.log(res)
      return true
    }
  })
}

function like(txid){
  // var pkey = document.getElementById('pkey').value
  var pkey = localStorage.getItem('pk');
  var likeCounter = document.getElementById("like_counter_"+txid)
  var likeImg = document.getElementById("like_"+txid)
  var prefix = PrefixLike
  var reverseByteTxId = "0x"+reverseBytes(txid)
  var tx = {
      data: [prefix, reverseByteTxId],
      cash: {
        key: pkey,
        rpc: DatacashRPC
      }
    }
  console.log("test like",txid,tx,pkey)
  datacash.send(tx, function(err, res) {
    if(err != null){
      console.log(err)
      return false
    }else{
      likeCounter.innerHTML = parseInt(likeCounter.innerHTML) + 1
      likeImg.src = ImageLikeTrue
      console.log(res)
      return true
    }
  });
}

function check_link(link){
  return link
}

function check_type(type){
  return type
}

function check_title(title){
  return title
}

function play(hash,title,sender){
  console.log(hash,title);
  download_torrent(hash,title,sender);
}

function getBalance(address){
    var address = "qpy3cc67n3j9rpr8c3yx3lv0qc9k2kmfyud9e485w2";
    var url = BitindexApiURL +address;
    fetch(url).then(function(r) {
      return r.json()
    }).then(function(r) {
      console.log(r)
      document.getElementById("MenuBalance").innerHTML = r.data.balance + " satoshis";
    })
}

function getFromAPI() {
  // var search_string = document.getElementById('search').value

  var url = ApiURL+"/theca/all";
  console.log(url)
  var header = {
    headers: { key: "qz6qzfpttw44eqzqz8t2k26qxswhff79ng40pp2m44" }
  };

  // fetch(url, header).then(function(r) {
  fetch(url).then(function(r) {
    return r.json()
  }).then(function(r) {

    console.log(r)
    document.getElementById('bitdb_output').innerHTML = ""
    document.getElementById('bitdb_output_container').style.display = "block"

    if(r.length != 0){
      var tr = document.createElement('tr');
      for(i in r){
        var tx = r[i]
        list_tx_results(tx,true);
      };
    };
  })
};

function login(){
  var username = document.getElementById('loginUsername').value;
  var password = document.getElementById('loginPassword').value;

  var passwordHash = CryptoJS.SHA256(password).toString();

  var xhr = new XMLHttpRequest();
  var url = ApiURL+"/login";
  xhr.open("POST", url, true);
  xhr.setRequestHeader("Content-Type", "application/json");
  xhr.onreadystatechange = function () {
      if (xhr.readyState === 4 && xhr.status === 200) {
          var json = JSON.parse(xhr.responseText);
          if (json.Login) {
          var decryptedPrivatekey = CryptoJS.AES.decrypt(json.EncryptedPk,password).toString(CryptoJS.enc.Utf8);
          console.log(json);
          console.log("Login True => PK:",decryptedPrivatekey);

          document.getElementById('loginMenu').style.display='none'
          document.getElementById('signupMenu').style.display='none'
          document.getElementById('usernameMenu').style.display='block'
          var userIcon = document.createElement('img');
          userIcon.src = 'icons/user.png'
          document.getElementById('usernameMenuLink').innerHTML = "";
          document.getElementById('usernameMenuLink').appendChild(userIcon);
          document.getElementById('usernameMenuLink').innerHTML += json.Username;

          var loginModal = document.getElementById('loginModal');
          loginModal.style.display = "none";

          localStorage.setItem('pk', decryptedPrivatekey);
          localStorage.setItem('username', json.Username);
        } else {
          console.log("Login False");
        }
      }
  };
  var data = JSON.stringify({"Username": username, "PasswordHash": passwordHash});
  xhr.send(data);
}

function signup(){
  var username = document.getElementById('signupUsername').value;
  var password = document.getElementById('signupPassword').value;
  var privatekey = document.getElementById('signupPrivatekey').value;

  var passwordHash = CryptoJS.SHA256(password).toString();
  var encryptedPrivatekey = CryptoJS.AES.encrypt(privatekey,password).toString();

  var xhr = new XMLHttpRequest();
  var url = ApiURL+"/signup";
  xhr.open("POST", url, true);
  xhr.setRequestHeader("Content-Type", "application/json");
  xhr.onreadystatechange = function () {
      if (xhr.readyState === 4 && xhr.status === 200) {
          var json = JSON.parse(xhr.responseText);
          console.log(json);
      }
  };
  var data = JSON.stringify({"Username": username, "PasswordHash": passwordHash, "EncryptedPk": encryptedPrivatekey});
  xhr.send(data);
}


function openComments(txid){
  console.log(txid);
  var request = new XMLHttpRequest();
  var url = ApiURL+"/comments/"+txid;
  request.open('GET', url, true);
  request.onload = function () {
    var modal = document.getElementById("commentsModal");
    var span = modal.getElementsByClassName("close")[0];
    var content = modal.getElementsByClassName("modal-content")[0];
    var contentReset = "<span class='close'>&times;</span>";
    var title = document.createElement('h1');

    modal.style.display = "block";
    span.onclick = function() {
        modal.style.display = "none";
        content.innerHTML = contentReset;
    }

    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
            content.innerHTML = contentReset;
        }
    }

    var data = JSON.parse(this.response);
    console.log(data)
    if (request.status >= 200 && request.status < 400) {
      var ul = document.createElement('ul');
      if(data){
        data.forEach(tx => {
          var li = document.createElement('li');
          li.innerHTML =  "<a class='result-tx-link' data-toggle='tooltip' title='Tx-Data: " + JSON.stringify(tx) + "' target='_blank' href='https://blockchair.com/bitcoin-cash/transaction/"+ tx.Txid +"'><span class='glyphicon glyphicon-th'></span></a> "+tx.Message;
          ul.appendChild(li)
        });
        title.innerHTML = "Comments<br><input size='20' id='"+txid+"_comment'></input><button onclick='reply(`" + txid + "`)'>Send</button>"
      } else {
        title.innerHTML = "No Comments<br><input size='20' id='"+txid+"_comment'></input><button onclick='reply(`" + txid + "`)'>Send</button>"
      }

      content.appendChild(title)
      content.appendChild(ul)
    } else {
      console.log('error');
    }
  }
  request.send();
}

function list_tx_results(tx,confirmed){
  var tr = document.createElement('tr');
  var td_txid = document.createElement('td');
  var td_like = document.createElement('td');
  var td_comments = document.createElement('td');
  var td_6a_magnethash = document.createElement('td');
  var td_6a_title = document.createElement('td');
  var td_6a_type = document.createElement('td');
  var td_sender = document.createElement('td');
  var td_blockheight = document.createElement('td');
  var td_play = document.createElement('td');
  var td_score = document.createElement('td');


  td_txid.innerHTML = "<a class='result-tx-link' data-toggle='tooltip' title='Tx-Data: " + JSON.stringify(tx) + "' target='_blank' href='https://blockchair.com/bitcoin-cash/transaction/"+ tx.Txid +"'><span class='glyphicon glyphicon-th'></span></a>";
  td_txid.style.width = "15px";
  if (tx.Likes > 0){
    likeImage = ImageLikeTrue;
  }else{
    likeImage = ImageLikeFalse;
  }

  if (tx.Comments > 0){
    commentImage = ImageCommentsTrue;
    td_comments.innerHTML = "<button id='openComments_"+tx.Txid +"' onclick='openComments(`"+ tx.Txid +"`)'><img class='comment' id='comment_"+ tx.Txid +"' height='20' src='"+ commentImage +"'><span class='commentcounter' id='comment_counter_"+ tx.Txid +"'>"+ tx.Comments +"</span></button>"
  }else{
    commentImage = ImageCommentsFalse;
    td_comments.innerHTML = "<button id='openComments_"+tx.Txid +"' onclick='openComments(`"+ tx.Txid +"`)'><img class='comment' id='comment_"+ tx.Txid +"' height='20' src='"+ commentImage +"'><span class='commentcounter' id='comment_counter_"+ tx.Txid +"'>"+ tx.Comments +"</span></button>"
  }

  td_like.innerHTML = "<a title='like' onclick='like(`"+ tx.Txid +"`)'><img class='like' id='like_"+ tx.Txid +"' height='20' src='"+ likeImage +"'><span class='likecounter' id='like_counter_"+ tx.Txid +"'>"+ tx.Likes +"</span></a>"
  td_sender.innerHTML = tx.txid
  td_blockheight.innerHTML = (confirmed) ? (tx.BlockHeight) : ("unconfirmed")
  td_score.innerHTML = tx.Score

  var link = check_link(tx.Link)
  var type = check_type(tx.DataType)
  var title = check_title(tx.Title)

  if (link && type && title){
    td_6a_magnethash.innerHTML = "<a class='' href='"+ link +"'><img height='15' src='icons/icons8-magnet-filled-50.png'>" + link + "</a>";
    td_6a_title.innerHTML = title;
    td_6a_type.innerHTML = type;

    input_data = '"' + link + '","' + title + '","' + tx.Txid + '"'
    td_play.innerHTML = "<button title='play with webtorrent' class='result-play' onclick='play(" + input_data + ");'><span class='glyphicon glyphicon-play-circle'></span></button>";
    td_play.style.width = "15px";


    tr.appendChild(td_txid);
    tr.appendChild(td_like);
    tr.appendChild(td_comments);
    tr.appendChild(td_score);
    tr.appendChild(td_play);
    tr.appendChild(td_6a_title);
    tr.appendChild(td_6a_magnethash);
    tr.appendChild(td_blockheight);

    document.getElementById('bitdb_output').appendChild(tr);
  }
};

function get_video_data(hash,title,sender){
  // Insert Title
  document.getElementById('video_title').innerHTML = title

  var query = {
    request: {
      encoding: {
        b1: "hex"
      },
      find: {
        b1: { "$in": ["e902"] },
        s2: {
          "$regex": hash, "$options": "i"
        },
        'senders.a' :  {
          "$in": [sender]
        }
      },
      project: {
        b0:1 ,b1: 1, s2: 1, tx: 1, block_index: 1, _id: 0, senders: 1
      },
      limit: 10
    },
    response: {
      encoding: {
        b1: "hex"
      }
    }
  };
  var b64 = btoa(JSON.stringify(query));
  var url = "https://bitdb.network/v2/q/" + b64;

  var header = {
    headers: { key: "qz6qzfpttw44eqzqz8t2k26qxswhff79ng40pp2m44" }
  };

  fetch(url, header).then(function(r) {
    return r.json()
  }).then(function(r) {

    for(i in r['confirmed']){
      var tx = r['confirmed'][i];
      console.log(tx.s2);
      var p = document.createElement('p');
      p.innerHTML = tx.s2
      document.getElementById('video_description').appendChild(p)
    };

  })
}

function download_torrent(hash,title,sender){
  var torrentId = hash + "&tr=udp://explodie.org:6969&tr=udp://tracker.coppersurfer.tk:6969&tr=udp://tracker.empire-js.us:1337&tr=udp://tracker.leechers-paradise.org:6969&tr=udp://tracker.opentrackr.org:1337&tr=wss://tracker.openwebtorrent.com"

  var client = new WebTorrent()

  // HTML elements
  var $body = document.body
  var $progressBar = document.querySelector('#progressBar')
  var $numPeers = document.querySelector('#numPeers')
  var $downloaded = document.querySelector('#downloaded')
  var $total = document.querySelector('#total')
  var $remaining = document.querySelector('#remaining')
  var $uploadSpeed = document.querySelector('#uploadSpeed')
  var $downloadSpeed = document.querySelector('#downloadSpeed')

  // Download the torrent
  client.add(torrentId, function (torrent) {

    // insert data
    document.getElementById('torrentLink').innerHTML = torrentId

    // Video Data from Blockchain
    // get_video_data(hash,title,sender);

    // show divs
    document.getElementById('video_output_container').style.display = "block";

    // Torrents can contain many files. Let's use the .mp4 file
    var file = torrent.files.find(function (file) {
      return file.name.endsWith('.mp4')
    })

    // Stream the file in the browser
    file.appendTo('#output')

    // Trigger statistics refresh
    torrent.on('done', onDone)
    setInterval(onProgress, 500)
    onProgress()

    // Statistics
    function onProgress () {
      // Peers
      $numPeers.innerHTML = torrent.numPeers + (torrent.numPeers === 1 ? ' peer' : ' peers')

      // Progress
      var percent = Math.round(torrent.progress * 100 * 100) / 100
      $progressBar.style.width = percent + '%'
      $downloaded.innerHTML = prettyBytes(torrent.downloaded)
      $total.innerHTML = prettyBytes(torrent.length)

      // Remaining time
      var remaining
      if (torrent.done) {
        remaining = 'Done.'
      } else {
        remaining = moment.duration(torrent.timeRemaining / 1000, 'seconds').humanize()
        remaining = remaining[0].toUpperCase() + remaining.substring(1) + ' remaining.'
      }
      $remaining.innerHTML = remaining

      // Speed rates
      $downloadSpeed.innerHTML = prettyBytes(torrent.downloadSpeed) + '/s'
      $uploadSpeed.innerHTML = prettyBytes(torrent.uploadSpeed) + '/s'
    }
    function onDone () {
      $body.className += ' is-seed'
      onProgress()
    }
  })
}

// Human readable bytes util
function prettyBytes(num) {
  var exponent, unit, neg = num < 0, units = ['B', 'kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
  if (neg) num = -num
  if (num < 1) return (neg ? '-' : '') + num + ' B'
  exponent = Math.min(Math.floor(Math.log(num) / Math.log(1000)), units.length - 1)
  num = Number((num / Math.pow(1000, exponent)).toFixed(2))
  unit = units[exponent]
  return (neg ? '-' : '') + num + ' ' + unit
}
