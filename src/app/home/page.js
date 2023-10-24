import "./home.css";
import RepairItem from "./RepairItem";

const HomePage = () => {
  const repairItems = [
    { title: "Bike", services: ["Electric", "Engine", "Tyre"], card: "card1" },
    { title: "Car", services: ["Electric", "Engine", "Tyre"], card: "card2" },
    {
      title: "Tractor",
      services: ["Electric", "Engine", "Tyre"],
      card: "card3",
    },
    { title: "Truck", services: ["Electric", "Engine", "Tyre"], card: "card4" },
  ];
  return(
    <>
      {/* <NavWithAccess/> */}
      <div className="container">
        {repairItems.map((item, index) => (
          <RepairItem
            key={index}
            title={item.title}
            services={item.services}
            card={item.card}
          />
        ))}
      </div>
    </>
  );
};

export default HomePage;
