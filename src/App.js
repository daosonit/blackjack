import React, { Component } from 'react';
import './App.css';
import $ from 'jquery';

class App extends Component {
  constructor() {
    super();
    this.state = {
      deck: [],
      player: [],
      dealer: [],
      playerFinalScore: 0,
      dealerFinalScore: 0,
    };
  }

  startGame() {
    $(".box, .pwins, .news").fadeOut();
    $(".arena").fadeIn(1000);
  }

  getScore(person) {
    let sum = 0;
    for(let p of person) {
      if(p.name === "A") {
        if(sum + 11 > 21) {
          sum += 1;
          continue;
        }
      }
      sum += (p.val);
    }
    return sum;
  }

  getCard() {
    while(true) {
      var min=0;
      var max=51;
      var idx = Math.floor(Math.random() * (+max - +min)) + +min;
      console.log(idx);
      const { deck } = this.state;
      let deck_copy = deck;
      console.log(deck_copy.length);
      console.log(deck_copy);
      if(deck_copy[idx].val !== -1) {
        var card = {
          name: deck_copy[idx].name,
          val: deck_copy[idx].val,
          type: deck_copy[idx].type,
        }
        deck_copy[idx].val = -1;
        this.setState({
          deck: deck_copy,
        });
        return card;
      }
      else {
        continue;
      }
    }
  }

  distribute() {
    const { player, dealer } = this.state;
    let player_copy = player, dealer_copy = dealer;
    for(var i = 1; i <= 2; i++) {
      let card = this.getCard();
      player_copy.push(card);
    }
    for(var i = 1; i <= 2; i++) {
      let card = this.getCard();
      dealer_copy.push(card);
    }
    let pfs = this.getScore(player_copy), dfs = this.getScore(dealer_copy);
    this.setState({
      player: player_copy,
      dealer: dealer_copy,
      playerFinalScore: pfs,
      dealerFinalScore: dfs,
    });
  }


  deal() {
    let deck = [];
    let dups = ["A", "J", "Q", "K"];
    //black cards
    for(var j = 1; j <= 2; j++) {
      for(var i = 2; i <= 10; i++) {
        var card = {
          name: String(i),
          val: i,
          type: "B",
        }
        deck.push(card);
      }
      for(let each of dups) {
        var val;
        if(each === "A")
          val = 11;
        else
          val = 10;
        var card = {
          name: each,
          val: val,
          type: "B",
        }
        deck.push(card);
      }
    }
    //red cards
    for(var j = 1; j <= 2; j++) {
      for(var i = 2; i <= 10; i++) {
        var card = {
          name: String(i),
          val: i,
          type: "R",
        }
        deck.push(card);
      }
      for(let each of dups) {
        var val;
        if(each === "A")
          val = 11;
        else
          val = 10;
        var card = {
          name: each,
          val: val,
          type: "R",
        }
        deck.push(card);
      }
    }
    console.log(deck);

    this.setState({ deck: deck }, () => {  //as this.setState() is asynch
      this.distribute();
    });
    $(".butts").fadeIn();
    $(".begins").fadeOut();
  }

  playerHit() {
    const { player, dealer } = this.state;
    let player_copy = player, dealer_copy = dealer;
    let card = this.getCard();
    player_copy.push(card);
    let pfs = this.getScore(player_copy);
    this.setState({
      player: player_copy,
      playerFinalScore: pfs,
    }, () => {
      const { playerFinalScore } = this.state;
      setTimeout(function() {
        if(playerFinalScore > 21) {
          $(".damp").hide();
          $(".title1").html("PLAYER BUSTED \<br /> DEALER WINS !!");
          $(".pwins, .news").fadeIn();
        }
        else if(playerFinalScore === 21) {
          $(".damp").hide();
          $(".title1").html("PLAYER WINS !!");
          $(".pwins, .news").fadeIn();
        }
      }, 1000)
    });
  }

  playerStand() {

  }

  refresh() {
    this.setState({
      deck: [],
      player: [],
      dealer: [],
      playerFinalScore: 0,
      dealerFinalScore: 0,
    }, () => {
      $(".pwins, .news").fadeOut();
      $(".damp, .begins").fadeIn();
    });
  }

  render() {
    const { player, dealer, playerFinalScore, dealerFinalScore } = this.state;
    const player_cards = player.map((card) => {
    if(card.type === "B") {
      return <li className="card_B">{card.name}</li>
    } else {
      return <li className="card_R">{card.name}</li>
    }
    });
    const dealer_cards = dealer.map((card) => {
    if(card.type === "B") {
      return <li className="card_B">{card.name}</li>
    } else {
      return <li className="card_R">{card.name}</li>
    }
    });
    return (
      <div className="App container">
        <div className="box">
          <h1 className="title">Blackjack</h1>
          <br />
          <button className="btn btn-default new_game" onClick={this.startGame.bind(this)}>START</button>
        </div>
        <div className="arena">
          <h1 className="min-title">Blackjack</h1>
          <div className="pwins"><h1 className="title1"></h1></div>
          <button className="btn btn-default begin_game news" onClick={this.refresh.bind(this)}>NEW GAME</button>
          <div className="row damp">
            <div className="col-md-6 player">
              <h4 className="player-tag">YOU&nbsp;:&nbsp;{playerFinalScore}</h4>
              <ul className="player_list">{player_cards}</ul>
              <div className="butts">
                <ul className="butt_list">
                  <li className="each_butt"><button class="btn btn-default begin_game" onClick={this.playerHit.bind(this)}>HIT</button></li>&nbsp;&nbsp;
                  <li className="each_butt"><button class="btn btn-default begin_game" onClick={this.playerStand.bind(this)}>STAND</button></li>
                </ul>
              </div>
            </div>
            <div className="col-md-6 dealer">
              <h4 className="dealer-tag">DEALER&nbsp;:&nbsp;{dealerFinalScore}</h4>
              <ul className="dealer_list">{dealer_cards}</ul>
            </div>
          </div>
          <button className="btn btn-default begin_game begins" onClick={this.deal.bind(this)}>BEGIN</button>
        </div>
      </div>
    );
  }
}

export default App;
