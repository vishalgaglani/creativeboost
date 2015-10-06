/*------------------------------------*\
    Logic for the 5 minute creative boost v1
    Vishal Gaglani-2015

    Written in Angular-Js & Jquery
\*------------------------------------*/


//Initialize Angular Module

var app = angular.module('creativeBoost', []);

// Main application control - DEPENDS ON SCOPE, HTTP service for JSON, and Server Timeout for TIMER

app.controller('anagramCtrl', function($scope, $http, $timeout) {
		
		//Testing unit, ignore this... 
		$scope.word = {
			guess: "",	
			solved: "cat",
			mixed: "tac",
			hint: "meow!", 
			match: false
		};


		//*************INTIALIZE AND LOAD****************//


		//State variables
		$scope.inProgress = false;
		$scope.score = 0;
		$scope.quizOver = false;	



		//Dummy Array 
		$scope.anagrams = [];
		$scope.anagramHolder = [];



		//Initialize variables and start the game
		$scope.start = function() {
        		$scope.quizOver = false;
				$scope.inProgress = true;
				$scope.startTimer($scope, $timeout);		
		};



		//Load Anagrams from JSON file

		$http.get('anagrams.json').success(function(anagrams){
			
			//http load in dummy array - (ideally nest in loop, once more anagrams are added)
			$scope.anagramHolder = anagrams;

			//Anagram loading function - Currently loads 15
			for (var i = 0; i < 14; i++)
			{
				//get random array index
				var rand = Math.floor((Math.random() * $scope.anagramHolder.length));

				//store in dummy 
				var temp = $scope.anagramHolder[rand];
				
				//check to make sure it is not already in array
				var check = $.inArray(temp,$scope.anagrams);
				if (check === -1) {
					$scope.anagrams[i] = temp;
				}
				else { i--;}
			}

		});

	
		//Show hint method - for version 2
		$scope.showHint = function (questions) {
			console.log()	
		}



		//*************LOGIC****************//


		//Check to see if the guess matches the answer (on keyup)
		$scope.checkAnswer = function(id) {
				//Convert to uppercase
				var guess = $scope.anagrams[id].guess.toUpperCase();
				var answer = $scope.anagrams[id].solved.toUpperCase();
				
				//Compare guess with correct answer
				if(guess == answer) {
					//Set match variable
					$scope.anagrams[id].match = true;
					//increment score
					$scope.score++;
				}   else {
					//scope.correctAns = false;
				}
		};



		//*************TIMER****************//



		//Intialize Timer from Hell
		$scope.startTimer = function($scope,$timeout) {
		    $scope.counter = 300;
		    $scope.stopped = false;
		    $scope.buttonText='Stop';
		

			//Timer Logic    
			$scope.onTimeout = function(){
			        $scope.counter--;
			        mytimeout = $timeout($scope.onTimeout,1100);
			    	}
			    
			    	var mytimeout = $timeout($scope.onTimeout,1000);
		   
			//End quiz on timeout    	
		 	$scope.$watch('counter', function(newValue, oldValue)
				 	{
				 		if(newValue <= 0){
				 			$scope.quizOver = true;
				 			$scope.inProgress = false;
				 		}
				 	});

	 	};   

});


//FORMAT TIMER DATA 

app.filter('formatTimer', function() {
  return function(input)
    {
        function z(n) {return (n<10? '0' : '') + n;}
        var seconds = input % 60;
        var minutes = Math.floor(input / 60);
        var hours = Math.floor(minutes / 60);
        return (z(minutes)+':'+z(seconds));
    };
});


