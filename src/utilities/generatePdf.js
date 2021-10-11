import PdfPrinter from "pdfmake";

export const generatePdf = (profile, exp) => {
  const fonts = {
    Roboto: {
      normal: "Helvetica",
      bold: "Helvetica-Bold",
      italics: "Helvetica-Oblique",
      bolditalics: "Helvetica-BoldOblique",
    },
  };
  const experiences = [];

  exp.forEach((elem, index) => {
    experiences.push(`Experience: ${index + 1}`);
    experiences.push("  ");
    experiences.push(elem.role);
    experiences.push("  ");
    experiences.push(elem.company);
    experiences.push("  ");
    experiences.push(`From: ${elem.startDate.toString()}`);
    experiences.push("  ");
    experiences.push(`To: ${elem.endDate.toString()}`);
    experiences.push("  ");
    experiences.push(elem.experienceArea);
    experiences.push("  ");
    experiences.push(
      " ----------------------------------------------------------------------------------------------------------- "
    );
    experiences.push("  ");
  });

  const string = experiences.toString();
  console.log(string);

  const printer = new PdfPrinter(fonts);

  const docDefinition = {
    content: [
      `username:      ${profile.username}`,
      " ",
      `name:             ${profile.name}`,
      " ",
      `surname:        ${profile.surname}`,
      " ",
      `email:             ${profile.email}`,
      " ",
      `bio:                 ${profile.bio}`,
      " ",
      `title:                ${profile.title}`,
      " ",
      `area:               ${profile.area}`,
      " ",
      " ",
      " ",
      experiences,
    ],
  };

  const arvand = ["arvand", "molla", 41];

  //   const docDefinition = {
  //     content: experiences,
  //   };

  const options = {
    // ...
  };

  const pdfReadableStream = printer.createPdfKitDocument(
    docDefinition,
    options
  );
  pdfReadableStream.end();

  return pdfReadableStream;
};
