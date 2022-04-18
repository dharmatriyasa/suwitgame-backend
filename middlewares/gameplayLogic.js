module.exports = function(player1Id, player2Id, player1Input, player2Input){

    if(player1Input === player2Input){
        return 0;
    }else if(player1Input === 'R'){
        if(player2Input === 'P'){
            return player2Id;
        }else if(player2Input === 'S'){
            return player1Id;
        }
    }else if(player1Input === 'P'){
        if(player2Input === 'S'){
            return player2Id;
        }else if(player2Input === 'R'){
            return player1Id;
        }
    }else if(player1Input === 'S'){
        if(player2Input === 'R'){
            return player2Id;
        }else if(player2Input === 'P'){
            return player1Id;
        }
    }
}