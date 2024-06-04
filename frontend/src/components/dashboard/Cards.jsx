/* eslint-disable react/prop-types */

const Cards = ({ title, icon, heading, subHead }) => {
  return (
    <div className=" w-full xl:w-[250px] h-[138px] bg-white shadow rounded-xl border flex flex-col gap-2  p-7">
      <div className=" flex flex-row justify-between items-center">
        <p className=" text-zinc-800 font-medium text-sm">{title}</p>
        <img 
          // src="https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.indiamart.com%2Fproddetail%2Fpg-rooms-12393171491.html&psig=AOvVaw2QXGvRthjHU7x9SxFfZ8Ck&ust=1713971819816000&source=images&cd=vfe&opi=89978449&ved=0CBIQjRxqFwoTCKjn5t7Q2IUDFQAAAAAdAAAAABAE"
          src={icon} 
          alt="dollar" 
          className=" w-6" />
      </div>

      <div className=" flex flex-col">
        <h3 className=" text-2xl text-zinc-800 font-semibold">{heading}</h3>
        <p className=" text-xs text-[#717171]">{subHead}</p>
      </div>
    </div>
  );
};

export default Cards;
