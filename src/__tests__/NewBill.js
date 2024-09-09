/**
 * @jest-environment jsdom
 */

import { screen, fireEvent } from "@testing-library/dom"
import "@testing-library/jest-dom"
import NewBillUI from "../views/NewBillUI.js"
import NewBill from "../containers/NewBill.js"
import { bills } from "../fixtures/bills.js"
import userEvent from "@testing-library/user-event"
import { ROUTES, ROUTES_PATH } from "../constants/routes"
import {localStorageMock} from "../__mocks__/localStorage.js";
import mockStore from "../__mocks__/store";

jest.mock("../app/store", () => mockStore)
describe("Given I am connected as an employee", () => {
  describe("When I am on NewBill Page", () => {
    test("Then it should renders NewBill form", () => {
      document.body.innerHTML = NewBillUI()

      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname })
      }

      Object.defineProperty(
        window,
        'localStorage',
        { value: localStorageMock }
      )

      const newBill = new NewBill(
        {document, onNavigate, mockStore, localStorageMock}
      )

      expect(screen.getByTestId("form-new-bill")).toBeInTheDocument()
      
      const expenseType = screen.getByTestId("expense-type")
      expect(expenseType.value).toBe("Transports")
      expect(expenseType.childElementCount).toEqual(7)

      const expenseName = screen.getByTestId("expense-name")
      expect(expenseName.value).toBe("")

      const datePicker = screen.getByTestId("datepicker")
      expect(datePicker.value).toBe("")

      const amount = screen.getByTestId("amount")
      expect(amount.value).toBe("")

      const vat = screen.getByTestId("vat")
      expect(vat.value).toBe("")
      
      const pct = screen.getByTestId("pct")
      expect(pct.value).toBe("")
      
      const commentary = screen.getByTestId("commentary")
      expect(commentary.value).toBe("")
            
      const file = screen.getByTestId("file")
      expect(file.value).toBe("")

    }),
    describe("When I change the supporting file", () => {
      test("Then it use valid extension file", async () => {
        document.body.innerHTML = NewBillUI()

        const onNavigate = (pathname) => {
          document.body.innerHTML = ROUTES({ pathname })
        }
        Object.defineProperty(
          window,
          'localStorage',
          { value: localStorageMock }
        )

        const newBill = new NewBill(
          {document, onNavigate, store:mockStore, localStorage:localStorageMock}
        )
        
        const alertSpy = jest.spyOn(window, 'alert').mockImplementation(() => {});

        const mockedFile = new File([""], "test.jpg", { type: "image/jpg" });
        const handleChangeFile = jest.fn(e => newBill.handleChangeFile(e))
        const file = screen.getByTestId("file")
        file.addEventListener('change', handleChangeFile)

        fireEvent.change(file, { target: { files: [mockedFile] } })
        
        expect(handleChangeFile).toHaveBeenCalled()

        expect(alertSpy).not.toHaveBeenCalledWith('Veuillez choisir une image (jpg, jpeg ou png)');
      }),
      test("Then it use unvalid extension file", () => {
        document.body.innerHTML = NewBillUI()

        const onNavigate = (pathname) => {
          document.body.innerHTML = ROUTES({ pathname })
        }
        Object.defineProperty(
          window,
          'localStorage',
          { value: localStorageMock }
        )

        const newBill = new NewBill(
          {document, onNavigate, store:mockStore, localStorage:localStorageMock}
        )

        const alertSpy = jest.spyOn(window, 'alert').mockImplementation(() => {});

        const mockedFile = new File([""], "test.mp4", { type: "video/mp4" });
        const file = screen.getByTestId("file")
        const handleChangeFile = jest.fn(newBill.handleChangeFile)
        file.addEventListener('change', handleChangeFile)

        fireEvent.change(file, { target: { files: [mockedFile] } })
        
        expect(handleChangeFile).toHaveBeenCalled()
        expect(alertSpy).toHaveBeenCalledWith('Veuillez choisir une image (jpg, jpeg ou png)');
      })
    }),
    test("Then it should save new bill", () => {
      document.body.innerHTML = NewBillUI()

      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname })
      }
      Object.defineProperty(
        window,
        'localStorage',
        { value: localStorageMock }
      )

      const newBill = new NewBill(
        {document, onNavigate, mockStore, localStorageMock}
      )

      const formNewBill = screen.getByTestId("form-new-bill")
      const handleSubmit = jest.fn(newBill.handleSubmit)
      formNewBill.addEventListener('submit', handleSubmit)
      fireEvent.submit(formNewBill)
      
      expect(handleSubmit).toHaveBeenCalled()
    })
  })
})
