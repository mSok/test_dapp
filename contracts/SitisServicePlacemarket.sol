// Контракт для услуг на площадки SitisPlaceMarket
pragma solidity ^0.4.17;

contract SitisPlaceMarket {
    // создтель контракта
    address public owner;
    // адрес контракта арбитража
    address public arbiterWallet;

    constructor (address _arbiter) public {
        owner = msg.sender;
        arbiterWallet = _arbiter;
    }

    modifier onlyOwner() {
        require(msg.sender == owner);
        _;
    }
    // услуга/товар
    struct Service {
        uint256 id;
        bytes32 serviceHash;
        uint256 amount;
        address serviceOwner;
        bool closed;
    }
    // купленные услуги
    struct purchasedService {
        uint256 id;
        uint256 serviceId;
        uint256 cnt;
        address buyer;
        // 0 деньги в резерве, 1 завершен, покупка подтверждена, деньги ушли
        // 2 арбитраж, 3 отмена покупки согласована
        uint8 status;
        bool cancelBuyer;  // отменил покупатель
        bool cancelOwner;  // отменил продавец
        bool closed;  // совершенные
    }
    // маппинг услуг
    mapping(uint256 => Service) public services;
    mapping(bytes32 => Service) public hashServices;
    uint256 public serviceCount;

    // маппинг покупок
    mapping(uint256 => purchasedService) public purchases;
    uint256 public purchasesCount;

    // покупка услуги
    event buyServiceEvent (
        address indexed buyerAddresss,
        uint256 purchaseId,
        address indexed serviceOwner,
        uint256 value
    );
    // создание услуги на продажу
    event serviceCreateEvent (
        bytes32 indexed serviceHash,
        uint256 serviceId,
        uint256 amount,
        address serviceOwner
    );
    // закрытие продажи услуги
    event serviceCloseEvent (
        uint256 serviceId
    );
    // закрытие сделки
    event purchaseCloseEvent(
        uint256 _purchaseId,
        uint256 _amount
    );
    // отмена покупки какой либо стороной
    event cancelPurchaseEvent(
        uint256 purchaseId,
        uint256 serviceId,
        uint256 amount,
        bool cancelOwner,
        bool cancelBuyer,
        uint8 status
    );

    // маппинг покупок по покупателю (адрес покупателя => id покупки)
    // mapping(address => uint) public buyerPurchases;

    function createService (
        bytes32 _serviceHash,
        uint256 _amount
    ) public
        returns (uint256 serviceId) {
        serviceCount ++;
        Service storage c = services[serviceCount];
        c.id = serviceCount;
        c.amount = _amount;  // стоимость за единицу
        c.serviceHash = _serviceHash;
        c.closed = false;
        c.serviceOwner = msg.sender;
        services[serviceCount] = c;
        hashServices[_serviceHash] = c;
        emit serviceCreateEvent(
            _serviceHash,
            serviceCount,
            _amount,
            msg.sender
        );
        return serviceCount;
    }
    // закрыть услугу, больше не предоставлять.
    function closeService (
        uint256 _serviceId
    ) public
        returns (uint256 serviceId) {
        Service storage c = services[_serviceId];
        require(msg.sender == c.serviceOwner);
        c.closed = true;
        services[_serviceId] = c;
        hashServices[c.serviceHash] = c;
        emit serviceCloseEvent(
            _serviceId
        );
        return serviceCount;
    }
    // закрыть покупку, перечислить средства продавцу.
    function closePurchase (
        uint256 _purchaseId
    ) public {
        purchasedService storage pc = purchases[_purchaseId];
        require(msg.sender == pc.buyer || msg.sender == arbiterWallet);
        // закрыть можно только сделки в "рабочем" или покупатель согласился статусе
        require(pc.status == 0 || pc.status == 2);
        require(pc.id != 0);
        Service storage c = services[pc.serviceId];
        uint256 amount = pc.cnt * c.amount;
        address(c.serviceOwner).transfer(amount);
        pc.closed = true;
        pc.status = 1;
        purchases[_purchaseId] = pc;
        emit purchaseCloseEvent(
            _purchaseId,
            amount
        );
    }
    // купить услугу
    function buyService (
        uint256 _serviceId,
        uint256 _cnt
    ) payable public
        returns (uint256 purchasesId) {
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
        pc.id = purchasesCount;
        pc.cnt = _cnt;
        pc.buyer = msg.sender;
        pc.closed = false;
        pc.status = 0;
        purchases[purchasesCount] = pc;

        emit buyServiceEvent(
            msg.sender,
            purchasesCount,
            c.serviceOwner,
            msg.value
        );
        return purchasesCount;
    }

    // отмена покупки
    function cancelService (
        uint256 _purchaseId
    ) public {
        purchasedService storage pc = purchases[_purchaseId];
        Service storage c = services[pc.serviceId];
        require(c.id != 0);
        // отменить может только покупатель или продавец
        require(msg.sender == pc.buyer || msg.sender == c.serviceOwner);
        require(pc.closed == false);

        uint256 amount = pc.cnt * c.amount;
        if (msg.sender == pc.buyer) {
            pc.cancelBuyer = true;
        }
        if (msg.sender == c.serviceOwner) {
            pc.cancelOwner = true;
        }
        // оба согласны;
        if (pc.cancelOwner == true && pc.cancelBuyer == true) {
            pc.closed = true;
            pc.status = 3;
            // возврат денег покупателю
            address(msg.sender).transfer(amount);
        } else {
            pc.status = 2; // арбитраж
        }
        // сохраняем статус покупки
        purchases[_purchaseId] = pc;
        emit cancelPurchaseEvent(
            _purchaseId,
            pc.serviceId,
            amount,
            pc.cancelOwner,
            pc.cancelBuyer,
            pc.status
        );
        return;
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
    // debug only
    function withdrawFunds(
        address _beneficiary,
        uint256 _weiAmount
    ) public onlyOwner {
        address(_beneficiary).transfer(_weiAmount);
    }

    function changeArbiter(
        address _newArbiterWalet
    ) public onlyOwner {
        arbiterWallet = _newArbiterWalet;
    }
}