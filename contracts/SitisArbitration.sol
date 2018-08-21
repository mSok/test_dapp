// Контракт для арбитража
pragma solidity ^0.4.17;


// abstract methods
contract SitisPlaceMarketInt {
    function closePurchase (uint256 _purchaseId) public returns (bool result);
    function cancelService (uint256 _purchaseId) public returns (bool result);
}


contract SitisArbitration {

    // solidity сходит с ума, при переходе от положительного к отрицательному.
    // Будем считать MID_VOTE - начальным занчением голосования
    uint16 constant MID_VOTE = 2000;
    address public owner;
    // адрес контракта SitisServicePlacemarkert
    address public sitisServicePlacemarkert;
    // список арбитров
    // address[] public arbiterList;
    mapping(address => bool) arbiterList;
    uint16 public arbiterListCount;

    constructor (address _market, address[] _arbiterList) public {
        owner = msg.sender;
        sitisServicePlacemarkert = _market;
        for (uint i = 0; i < _arbiterList.length; i++) {
            arbiterList[_arbiterList[i]] = true;
            arbiterListCount += 1;
        }
        // arbiterList = _arbiterList;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner");
        _;
    }
    
    modifier onlyPlaceMarket() {
        // только площадка может создавать или автор контракта
        require(msg.sender == sitisServicePlacemarkert || msg.sender == owner, "Only PlaceMarket");
        _;
    }

    function addArbiter(
        address _newArbiterWalet
    ) public onlyOwner {
        arbiterList[_newArbiterWalet] = true;
    }

     // Арбитраж
    struct Arbitration {
        uint256 id;
        address buyerId;
        address serviceOwner;
        uint256 purchasedId;
        bool closed;
        uint created;
        uint16 limit_percent;  // минимальное кол-во голосов для закрытия сделки
        uint16 limit_days;  // кол-во дней через которое можно однозначно закрыть арбитраж
        // арбитраж => кто проголосовал
        mapping(address => bool) voitedArbiter;
        uint voitedCount;
    }
     // Создан спор для арбитража
    event createdArbitrationEvent(
        uint256 id
    );
    // Арбитраж закрыт
    event closedArbitrationEvent(
        uint256 id
    );
    event voteArbitrationEvent(
        uint id,
        uint16 voteRes
    );

    // маппинг арбитражей
    mapping (uint256 => Arbitration) public arbiterStats;
    // кол-во арбитражей
    uint256 public arbiterCount;

    // результаты арбитраж => + toBuyer;  - toServiceOwner
    mapping(uint => uint16) public voitedResults;

    // создать арбитраж по сделке
    function createArbitration (
        address _buyerId,
        address _serviceOwner,
        uint256 _purchasedId,
        uint16 _limit_percent,
        uint16 _limit_days
    ) public onlyPlaceMarket
        returns (uint256 arbiterId) {
        arbiterCount++;
        arbiterStats[arbiterCount] = Arbitration({
            id: arbiterCount,
            buyerId : _buyerId,
            serviceOwner: _serviceOwner,
            purchasedId: _purchasedId,
            closed: false,
            created: now,
            voitedCount: 0,
            limit_percent: _limit_percent,
            limit_days: _limit_days
        });
        voitedResults[arbiterCount] = MID_VOTE;
        emit createdArbitrationEvent(arbiterCount);
        return arbiterCount;
    }

    function vote(uint arbitrationId, bool result) public
    returns (uint16) {
        validArbiter(arbitrationId);
        Arbitration storage a = arbiterStats[arbitrationId];
        require (a.created != 0, "not created arbitration");

        a.voitedArbiter[msg.sender] = true;
        a.voitedCount += 1;
        require (a.closed == false, "arbitration closed");

        if (result){
            voitedResults[arbitrationId] += 1;
        } else {
            voitedResults[arbitrationId] -= 1;
        }
        emit voteArbitrationEvent(
            arbitrationId,
            voitedResults[arbitrationId]
        );
        return voitedResults[arbitrationId];
    }

    // закрыть арбитраж
    function closeVote(uint arbitrationId) public
    returns (bool) {
        validCloseArbitration(arbitrationId);
        Arbitration storage a = arbiterStats[arbitrationId];
        a.closed = true;
        SitisPlaceMarketInt _placemarketContract = SitisPlaceMarketInt(sitisServicePlacemarkert);
        bool res = false;
        if (a.voitedCount <= 2000) {
            // закрыть покупку, перечислить средства продавцу.
            // function closePurchase (uint256 _purchaseId)
            res = _placemarketContract.closePurchase(a.purchasedId);
        } else {
            // отправляем средства покупателю
            res = _placemarketContract.cancelService(a.purchasedId);
        }
        emit closedArbitrationEvent(arbitrationId);
        return res;
    }

    // вычислить процент целочисленный с точностью
    function percent(uint numerator, uint denominator, uint precision)
    public view returns(uint quotient) {
        // caution, check safe-to-multiply here
        uint _numerator = numerator * 10 ** (precision+1);
        // with rounding of last digit
        uint _quotient = ((_numerator / denominator) + 5) / 10;
        return ( _quotient);
    }
    // проголосовал ли арбитер с адресом addr в арбитраже arbiterId
    function getVoitedArbiter(uint arbiterId, address addr) public view returns (bool) {
        return arbiterStats[arbiterId].voitedArbiter[addr];
    }

    function validArbiter(uint arbiterId) public view returns (bool) {
        // Проверяем что арбитер есть в списке арбитров
        require(arbiterList[msg.sender] == true, "not in arbiter list");
        // // Проверяем что арбитер еще не отдал голос
        Arbitration storage a = arbiterStats[arbiterId];
        require(a.voitedArbiter[msg.sender] == false, "already voited");
        return true;
    }

    function validCloseArbitration(uint arbiterId) internal view  {
        require(arbiterId <= arbiterCount && arbiterId > 0, "not valid Id");
        Arbitration storage a = arbiterStats[arbiterId];
        uint percenVoited = percent(a.voitedCount, arbiterListCount, 3);
        uint diff = (now - a.created) / 60 / 60 / 24;  // days
        uint _limit_percent = a.limit_percent * 10;
        require(percenVoited >= _limit_percent && diff <= a.limit_days, "not enough voited");
    }
}
