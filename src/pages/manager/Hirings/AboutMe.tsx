const AboutMe = () => {
  return (
    <div className="bg-[#fafafa] border border-[rgba(20, 20, 20, 0.1)] p-6 mb-6">
      <h2 className="text-[20px] font-bold text-[rgba(20, 20, 20, 1)]-600 mb-3">About Me</h2>
      <p className="text-[rgba(20, 20, 20, 0.8)] font-light text-[16px] leading-relaxed">
        {
          "I'm a product designer + filmmaker currently working remotely at Twitter from beautiful Manchester, United Kingdom. I'm passionate about designing digital products that have a positive impact on the world."
        }
      </p>
      <p className="text-[rgba(20, 20, 20, 0.8)] font-light text-[16px] leading-relaxed mt-3">
        {
          "For 10 years, I've specialised in interface, experience & interaction design as well as working in user research and design strategy for product agencies, big tech companies & start-ups."
        }
      </p>
    </div>
  );
};

export default AboutMe;
