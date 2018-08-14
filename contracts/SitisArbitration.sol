// Контракт для арбитража
pragma solidity ^0.4.17;

contract SitisArbitration {
    address public owner;
    // адрес контракта SitisServicePlacemarkert
    address public sitisServicePlacemarkert;
    // список арбитров
    address[] public arbiterList;

    constructor (address _market, address[] _arbiterList) public {
        owner = msg.sender;
        sitisServicePlacemarkert = _market;
        arbiterList = _arbiterList;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner");
        _;
    }

     // Арбитраж
    struct Arbitration {
        uint256 id;
        uint256 buyerId;
        uint256 serviceOwner;
        uint256 purchasedId;
        bool closed;
        uint created;
        uint8 limit_percent;  // минимальное кол-во голосов для закрытия сделки
        uint8 limit_days;  // кол-во дней через которое можно однозначно закрыть арбитраж
    }
     // Создан спор для арбитража
    event createdArbitrationEvent(
        uint256 id
    );
    // маппинг арбитражей
    mapping (uint256 => Arbitration) arbiterStats;
    // кол-во арбитражей
    uint256 public arbiterCount;
    // арбитраж => кто проголосовал
    mapping(uint => address[]) public voitedArbiter;
    // результаты арбитраж => + toBuyer;  - toServiceOwner
    mapping(uint => int) public voitedResults;

    // создать арбитраж по сделке
    function createArbitration (
        uint256 _buyerId,
        uint256 _serviceOwner,
        uint256 _purchasedId,
        uint8 _limit_percent,
        uint8 _limit_days

    ) public
        returns (uint256 arbiterId) {
        // только площадка может создавать или автор контракта
        require(msg.sender == sitisServicePlacemarkert || msg.sender == owner, "not access");
        arbiterCount++;
        arbiterStats[arbiterCount] = Arbitration({
            id: arbiterCount,
            buyerId : _buyerId,
            serviceOwner: _serviceOwner,
            purchasedId: _purchasedId,
            closed: false,
            created: now,
            limit_percent: _limit_percent,
            limit_days: _limit_days
        });
        emit createdArbitrationEvent(arbiterCount);
        return arbiterCount;
    }

    function vote(uint arbitrationId, bool result) public 
    returns (int) {
        validateVote(arbitrationId);
        if (result){
            voitedResults[arbitrationId] += 1;
        } else {
            voitedResults[arbitrationId] -= 1;
        }
        return voitedResults[arbitrationId];
    }

    function validateVote(uint arbitrationId) public view{
        validArbiter(arbitrationId);
        validCloseArbitration(arbitrationId);

    }
    // вычислить процент целочисленный с точностью
    function percent(uint numerator, uint denominator, uint precision) internal
        view returns(uint quotient) {
        // caution, check safe-to-multiply here
        uint _numerator = numerator * 10 ** (precision+1);
        // with rounding of last digit
        uint _quotient = ((_numerator / denominator) + 5) / 10;
        return ( _quotient);
    }

    function validArbiter(uint arbiterId) internal view returns (bool) {
        bool _in_arbiter_list = false;
        bool _in_voited_list = false;

        for (uint i = 0; i < arbiterList.length; i++) {
            _in_arbiter_list = arbiterList[i] == msg.sender;
        }
        require(_in_arbiter_list == true, "not in arbiter list");
        for (i = 0; i < voitedArbiter[arbiterId].length; i++) {
            _in_voited_list = voitedArbiter[arbiterId][i] == msg.sender;
        }
        require(_in_voited_list == false, "already voited");
    }

    function validCloseArbitration(uint arbiterId) internal view returns (bool) {
        Arbitration storage a = arbiterStats[arbiterId];
        uint percenVoited = percent(voitedArbiter[arbiterId].length, arbiterList.length, 3);
        uint diff = (now - a.created) / 60 / 60 / 24;  // days
        require(percenVoited < a.limit_percent * 10 && diff < a.limit_days, "not enough voited");
    }
}