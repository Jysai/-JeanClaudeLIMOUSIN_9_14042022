/**
 * @jest-environment jsdom
 */

import { fireEvent, screen, waitFor } from "@testing-library/dom"
import { ROUTES_PATH } from "../constants/routes.js";
import { ROUTES } from "../constants/routes";
import { localStorageMock } from "../__mocks__/localStorage.js";
import NewBillUI from "../views/NewBillUI.js";
import NewBill from "../containers/NewBill.js";
import mockStore from "../__mocks__/store.js";


import router from "../app/Router.js";

describe("Given I am connected as an employee", () => {
  describe("When I am on NewBill Page", () => {
    test("Then bill icon in vertical layout should be highlighted", async () => {
      Object.defineProperty(window, "localStorage", {
        value: localStorageMock,
      });
      window.localStorage.setItem(
        "user",
        JSON.stringify({
          type: "Employee",
        })
      );
      const root = document.createElement("div");
      root.setAttribute("id", "root");
      document.body.append(root);
      router();
      window.onNavigate(ROUTES_PATH.NewBill);
      await waitFor(() => screen.getByTestId("icon-mail"));
      const windowIcon = screen.getByTestId("icon-mail");
   
      expect(windowIcon.classList.contains("active-icon")).toBe(true);
    }); 


    test("Then when I click on 'choisir un fichier' I can select a file in JPG format", () => {

      document.body.innerHTML = NewBillUI();
      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname });
      };
      const newBill = new NewBill({ document, onNavigate, store: mockStore});
      const handleChangeFile = jest.fn(newBill.handleChangeFile);
      const buttonInput = screen.getByTestId("file");
      buttonInput.addEventListener("change", handleChangeFile);
      fireEvent.change(buttonInput, {
        target: {
          files: [new File(['test.jpg'], 'test.jpg', {type: 'image/jpg'})]
        }
      })
      expect(handleChangeFile).toBeCalled();
      expect(buttonInput.files[0].name).toBe("test.jpg");

    })

    describe("When I create a new bill", () => {
      test("send bills to mock API POST", async () => {
        const onNavigate = (pathname) => {
          document.body.innerHTML = ROUTES({ pathname });
        };
      
        const newBill = new NewBill({
          document, 
          onNavigate,
          store: mockStore,
          localStorage: window.localStorage
        })
  
        const buttonSendBill = screen.getByTestId('form-new-bill')
        const handleSubmit = jest.fn(newBill.handleSubmit)
        buttonSendBill.addEventListener('submit', handleSubmit)
        fireEvent.submit(buttonSendBill)

        expect(handleSubmit).toHaveBeenCalled()
  
      })
    })
  })
})
