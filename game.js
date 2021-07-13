/*
var gamePattern = new Array();
var buttonColours = ["red","blue","green","yellow"];


function nextSequence()
{
  var randomNumber = Math.floor(Math.random() * 4);

  var randomChosenColour = buttonColours[randomNumber];

  gamePattern.push(randomChosenColour);
}


var buttonArray = [];

function GetButtons()
{
buttonArray = document.querySelectorAll("button");
for (var i = 0; i < buttonArray.length; i++)
{
console.log(buttonArray[i]);
}
}
*/

var buttonArray = [];
var attackedZones = [];
var currentReinforcements = 3;
var maxReinforcements = 5;
var reinforceCap = 5;
var castleHealth = 100;
var score = 0;

var numberOfAttackers = 5;

//Deploy Phase

function deployRound()
{
  $("#reinforcements").show();
  $("#nextRound").prop("disabled",false);
  numberOfAttackers = Math.floor(Math.random()*6+2);
  if(score % 5 === 0 && score != 0)
  {
    $("#boss").show();
    numberOfAttackers+=score;
    currentReinforcements += 2;
    if(currentReinforcements > maxReinforcements)
    {
      currentReinforcements = maxReinforcements;
    }
  }
  else
  {
        $("#boss").hide();
  }
  console.log(numberOfAttackers);
  onNextRound("Finish Deployment",battlePhase);
  GetButtons();
  updateHud();
}

function GetButtons()
{
buttonArray = $(".gameButton");
for (var i = 0; i < buttonArray.length; i++)
{
  if(parseInt(buttonArray[i].textContent) <= 0)
  {
    $(buttonArray[i]).prop("disabled",true);
  }
  else
  {
    buttonArray[i].addEventListener("click",addReinforcements);
    $(buttonArray[i]).prop("disabled",false);
    $(buttonArray[i]).css("color","black");
  }


}
}

function addReinforcements()
{
if(currentReinforcements > 0 && parseInt(this.textContent) < 5 && parseInt(this.textContent) > 0 )
{
  var currentZoneValue = parseInt(this.textContent) + 1;
  this.textContent = currentZoneValue;
  currentReinforcements--;
  updateHud();
}
}


//Battle Phase

function battlePhase()
{
onNextRound("Battle Started", disableButtons())
setTimeout(chooseAttackZone,500);
}

function chooseAttackZone()
{
var randomNumber = Math.floor(Math.random()*8);
attackedZones.push(randomNumber);
var currentReinforcementsInZone = parseInt(buttonArray[randomNumber].textContent);
if(currentReinforcementsInZone === 0)
{
  attackedZones.pop();
  flashAttackedZone("#castle",null);
  damageCastle();
  if(castleHealth <= 0)
  {
      gameOver();
      return;
  }
}
else
{
  buttonArray[randomNumber].style.color = "red";
  flashAttackedZone(buttonArray[randomNumber],null);
}

    nextAttacker();

}

function flashAttackedZone(zone, colour)
{
  $(zone).css("background-color",colour);
  $(zone).fadeOut().fadeIn();

}

function disableButtons()
{
  $("#nextRound").unbind();
  $("#nextRound").prop("disabled",true);


for (var i = 0; i < buttonArray.length; i++)
{

  $(buttonArray[i]).prop("disabled",true);

}

}

function nextAttacker()
{
  numberOfAttackers--;
  if(numberOfAttackers >= 1)
  {
    battlePhase();
  }
  else
  {
    setTimeout(calculateBattles,1000);
  }
}

function calculateBattles()
{
  var attackerCount = 1;
  attackedZones = attackedZones.sort();
for (var i = 0; i < attackedZones.length; i++)
{
  console.log("Attacked in Zone "+attackedZones[i]);
  if(attackedZones[i + 1] == attackedZones[i])
{
  attackerCount++;
}
else
{
  simulateBattle(attackerCount,parseInt(buttonArray[attackedZones[i]].textContent),attackedZones[i]);
}

}
setTimeout(endOfBattlePhase,1000);
}

function simulateBattle(attackerStrength, defenderStrength, zone)
{
console.log(zone);
  var attackerScore = 0;
  for (var i = 0; i < attackerStrength; i++)
  {
    attackerScore += Math.floor(Math.random()*6+1);
  }

  var defenderScore = 0;
  for (var i = 0; i < defenderStrength; i++)
  {
    defenderScore += Math.floor(Math.random()*6+1);
  }
  console.log("Attackers: " + attackerScore + " Defenders: "+defenderScore);
if (attackerScore > defenderScore)
{
  if(attackerScore >= (defenderScore*3))
  {
      flashAttackedZone(buttonArray[zone],"coral");
      buttonArray[zone].textContent = parseInt(buttonArray[zone].textContent) - 2;
      if(parseInt(buttonArray[zone].textContent) <= 0)
      {
        buttonArray[zone].textContent = "0";
        $(buttonArray[zone]).animate({opacity: 0.2});
      }
  }
  else
  {
    flashAttackedZone(buttonArray[zone],"lightcoral");
    buttonArray[zone].textContent = parseInt(buttonArray[zone].textContent) - 1;
    if(parseInt(buttonArray[zone].textContent) <= 0)
    {
      buttonArray[zone].textContent = "0";
      $(buttonArray[zone]).animate({opacity: 0.2});
    }
  }

}
else
{
  flashAttackedZone(buttonArray[zone],"lightgreen");
}

}


function damageCastle()
{
  castleHealth -= Math.floor(Math.random()*20+1);
  $("#castleHealth").text("Keep Integrity: "+castleHealth+"%");
}

function endOfBattlePhase()
{
  score++;
  $("#score").text("Waves Survived: " + score);
  attackedZones = [];
  for (var i = 0; i < buttonArray.length; i++)
  {
  buttonArray[i].style.color = "black";
  buttonArray[i].style.backgroundColor = "white";
  }
  setTimeout(deployRound,500);
  if(currentReinforcements < maxReinforcements)
  {
        currentReinforcements++;
  }

}




// Config

function gameOver()
{
        $("#castleHealth").text("Castle Destroyed!");
        $("#nextRound").prop("disabled",false);
        $("#castle").animate({opacity:0.2});
        onNextRound("Restart",refreshGame);

}

function updateHud()
{
  $("#reinforcements").text("Reinforcements Remaining: "+currentReinforcements);
}

function onNextRound(nextText, nextRound)
{
  $("#nextRound").text(nextText);
  $("#nextRound").on("click",nextRound);
}

function Initialise()
{
  onNextRound("Start",deployRound);
        $("#castle").prop("disabled",true);
}

function refreshGame()
{
  buttonArray = $(".gameButton");
  for (var i = 0; i < buttonArray.length; i++)
  {
    $(buttonArray[i]).text("2");
    $(buttonArray[i]).animate({opacity:1});
    $(buttonArray[i]).css("color","black");
    $(buttonArray[i]).prop("disabled",false);
  }
    $("#boss").hide();
    $("#castle").animate({opacity:1});
  castleHealth = 100;
  score = 0;
  updateHud();
  currentReinforcements = 3;
  attackedZones = [];
  Initialise();
}

Initialise();
