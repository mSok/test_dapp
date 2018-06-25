// Контракт для услуг на площадки SitisPlaceMarket
pragma solidity ^0.4.17;

contract SitisPlaceMarket {

    // Address where funds are collected
    address public wallet;
    // услуга/товар
    struct Service {
        uint id;
        string serviceHash;
        uint amount;
        address serviceOwner;
        bool closed;
    }
    // купленные услуги
    struct purchasedService {
        uint id;
        uint serviceId;
        uint cnt;
        address buyer;
        bool closed;  // совершенные
    }
    // маппинг услуг
    mapping(uint => Service) public services;
    uint public serviceCount;

    // маппинг покупок
    mapping(uint => purchasedService) public purchases;
    uint public purchasesCount;

    event buyServiceEvent (
        address indexed _buyerAddresss,
        uint _purchaseId,
        address indexed _serviceOwner,
        uint256 _value
    );
    // маппинг покупок по покупателю (адрес покупателя => id покупки)
    // mapping(address => uint) public buyerPurchases;

    function createService (
        string _serviceHash,
        uint _amount
    ) public
        returns (uint serviceId) {
        serviceCount ++;
        Service storage c = services[serviceCount];
        c.id = serviceCount;
        c.amount = _amount;  // стоимость за единицу
        c.serviceHash = _serviceHash;
        c.closed = false;
        c.serviceOwner = msg.sender;
        services[serviceCount] = c;
        return serviceCount;
    }
    // закрыть услугу, больше не предоставлять.
    function closeService (
        uint _serviceId
    ) public
        returns (uint serviceId) {
        Service storage c = services[_serviceId];
        require(msg.sender == c.serviceOwner);
        c.closed = true;
        services[_serviceId] = c;
        return serviceCount;
    }
    // закрыть покупку, перечислить средства продавцу.
    function closePurchase (
        uint _purchaseId
    ) public {
        purchasedService storage pc = purchases[_purchaseId];
        require(msg.sender == pc.buyer);
        require(pc.id != 0);
        Service storage c = services[pc.serviceId];
        uint256 amount = pc.cnt * c.amount;
        c.serviceOwner.transfer(amount);
        pc.closed = true;
        purchases[_purchaseId] = pc;
    }
    // купить услугу
    function buyService (
        uint _serviceId,
        uint _cnt
    ) public payable
        returns (uint purchasesId) {
        Service storage c = services[_serviceId];
        _preValidatePurchase(
            c.serviceOwner,
            msg.value,
            c.id,
            _cnt
        );
        require(c.closed == false);
        purchasesCount ++;
        purchasedService storage pc = purchases[purchasesCount];
        pc.serviceId = _serviceId;
        pc.cnt = _cnt;
        pc.buyer = msg.sender;
        pc.closed = false;
        purchases[purchasesCount] = pc;
        _forwardFunds();

        emit buyServiceEvent(
            msg.sender,
            purchasesCount,
            c.serviceOwner,
            msg.value
        );
        return purchasesCount;
    }
    function _forwardFunds() internal {
        address(this).transfer(msg.value);
    }
    // validate purchase
    function _preValidatePurchase(
        address _beneficiary,
        uint256 _weiAmount,
        uint256 _serviceId,
        uint256 _purchasesCount
    )
        internal
    {
        require(_beneficiary != address(0));
        require(_weiAmount != 0);
        require(_serviceId != 0);
        Service storage c = services[_serviceId];
        require(c.id != 0);
        require(_purchasesCount != 0);
        require(c.amount * _purchasesCount <= _weiAmount);
    }
}