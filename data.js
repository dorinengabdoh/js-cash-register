const rootContainer = document.getElementById("container");
const root = ReactDOM.createRoot(rootContainer);

const currencies = [
  {
    name: "ONE HUNDRED",
    value: 100.0,
  },
  {
    name: "TWENTY",
    value: 20.0,
  },
  {
    name: "TEN",
    value: 10.0,
  },
  {
    name: "ONE HUNDRED",
    value: 100.0,
  },
  {
    name: "FIVE",
    value: 5.0,
  },
  {
    name: "ONE",
    value: 1.0,
  },
  {
    name: "QUARTER",
    value: 0.25,
  },
  {
    name: "DIME",
    value: 0.1,
  },
  {
    name: "NICKEL",
    value: 0.05,
  },
  {
    name: "PENNY",
    value: 0.01,
  },
];

const money = [
  {
    name: "Cash($)",
    num: "Number",
    id: 1,
  },
  {
    name: "PENNY",
    num: " 1.01",
    id: 2,
  },
  {
    name: "NICKEL",
    num: "2.05",
    id: 3,
  },
  {
    name: "DIME",
    num: "3.1",
    id: 4,
  },
  {
    name: "QUARTER",
    num: "4.25",
    id: 5,
  },
  {
    name: "ONE",
    num: "90",
    id: 6,
  },
  {
    name: "FIVE",
    num: "55",
    id: 7,
  },
  {
    name: "TEN",
    num: "20",
    id: 8,
  },
  {
    name: "TWENTY",
    num: "60",
    id: 9,
  },
  {
    name: "ONE HUNDRED",
    num: "100",
    id: 10,
  },
];

const MoneyItem = ({ name, num, id }) => {
  return (
    <div key={id}>
      <h4>{name}</h4>
      <div cMoneyItemlassName="fem">{num}</div>
    </div>
  );
};
function Sect() {
  const [billAmount, setbillAmount] = React.useState();
  const [cashGiven, setcashGiven] = React.useState();
  const currenciesRef = React.useRef(
    currencies.reduce((acc, curr) => ({ ...acc, [curr.name]: curr.value })),
    {}
  ); // {'ONE HUNDRED': 100, 'TWENTY: 60'}
  let result = "";
  const totalCashInDrawer = React.useMemo(
    () => money.reduce((acc, current) => acc + current.num, 0),
    [money]
  );
  const changeDue = React.useMemo(
    () => cashGiven - billAmount,
    [cashGiven, billAmount]
  );

  if (changeDue > totalCashInDrawer) {
    result = "Insufficient Funds";
  }

  if (changeDue === totalCashInDrawer) {
    result = "Closed";
  }

  // calculate change

  const calculateChange = () => {
    if (changeDue > 0) {
      const changes = [];
      let currentChangeDue = changeDue;
      for (let i = money.length - 1; i >= 0; i--) {
        const moneyItem = money[i];
        const baseUnit = currenciesRef.current[moneyItem.name]; //number of type baseunit can be subtracted from the change
        const changeMultiple = Math.floor(currentChangeDue / baseUnit);

        const moneyItemMultiple = moneyItem.num / baseUnit;

        if (
          currentChangeDue % baseUnit === 0 &&
          moneyItem.num >= currentChangeDue
        ) {
          changes.push({
            name: moneyItem.name,
            num: currentChangeDue,
            id: moneyItem.id,
          });
          currentChangeDue = 0;
          return { status: "OPEN", changes };
        }
        // if change  due  is base unit
        if (changeMultiple > 0) {
          const newMultiple =
            changeMultiple >= moneyItemMultiple
              ? moneyItemMultiple
              : changeMultiple;

          changes.push({
            name: moneyItem.name,
            num: newMultiple * baseUnit,
            id: moneyItem.id,
          });
          currentChangeDue -= newMultiple * baseUnit;
        }
      }

      if (currentChangeDue > 0) {
        return { status: "INSUFFICIENT FUNDS", changes: [] };
      }
    }
    return { status: "OPEN", changes: [] };
  };

  // convert change to a memo value

  const change = React.useMemo(() => calculateChange(), [changeDue, money]);

  function callback(event) {
    setbillAmount(event.target.value);
    console.log(billAmount);
  }

  function call(event) {
    setcashGiven(event.target.value);
    console.log(cashGiven);
  }

  return (
    <>
      <div className="container">
        <div className="heading">
          <h1>
            <strong>
              <i>Cash Register</i>
            </strong>
          </h1>
        </div>
        <p> Enter the bill amount</p>
        <div className="all">
          <input
            id="bill-amt"
            className="input-bill"
            placeholder="Bill Amount"
            type="number"
            value={billAmount}
            onChange={callback}
          />
          <input
            className="pay-amt"
            placeholder="Cash Given"
            type="number"
            value={cashGiven}
            onChange={call}
          />
        </div>
        <p className="usr-msg" />
        <button>Returned Change</button>
        <br />
        {result ? <p>{result}</p> : <p>{result}</p>}
        {change.changes.map((change) => (
          <MoneyItem key={change.id} num={change.num} name={change.name} />
        ))}
        <br />
        <div className="change-table">
          {money.map((item) => (
            <MoneyItem key={item.id} num={item.num} name={item.name} />
          ))}
        </div>
      </div>
    </>
  );
}

root.render(<Sect />);
