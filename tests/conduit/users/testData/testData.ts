export const testDataForInvalidEmail = [
  {
    id: 1,
    dataType: "empty string",
    data: "",
  },

  {
    id: 2,
    dataType: "no @ symbol",
    data: "userexample.com",
  },

  {
    id: 3,
    dataType: "no domain",
    data: "user@",
  },

  {
    id: 4,
    dataType: "no local part",
    data: "@example.com",
  },

  {
    id: 5,
    dataType: "no top-level domain",
    data: "user@example",
  },

  {
    id: 6,
    dataType: "double @ symbol",
    data: "user@@example.com",
  },

  {
    id: 7,
    dataType: "contains spaces",
    data: "user name@example.com",
  },

  {
    id: 8,
    dataType: "invalid characters",
    data: "user!#$%@example.com",
  },

  {
    id: 9,
    dataType: "consecutive dots",
    data: "user..name@example.com",
  },

  {
    id: 10,
    dataType: "null",
    data: null,
  },
];

export const testDataForInvalidPassword = [
  {
    id: 1,
    dataType: "empty string",
    data: "",
  },

  {
    id: 2,
    dataType: "null",
    data: null,
  },
];

export const testDataForInvalidName = [
  {
    id: 1,
    dataType: "empty string",
    data: "",
  },

  {
    id: 2,
    dataType: "contains underscore",
    data: "user_name",
  },

  {
    id: 3,
    dataType: "only spaces",
    data: "   ",
  },

  {
    id: 4,
    dataType: "contains special characters",
    data: "user@name!",
  },

  {
    id: 5,
    dataType: "null",
    data: null,
  },
];
