import React from "react";
import Taxes from "./Taxes";
import { render, screen, fireEvent } from "@testing-library/react";
import { product } from "advantage/subscribe/react/utils/test/Mocks";
import { Formik } from "formik";
import { QueryClient, QueryClientProvider } from "react-query";

describe("PaymentMethodSummary", () => {
  let queryClient: QueryClient;

  beforeEach(async () => {
    queryClient = new QueryClient();
  });

  it("renders country select correctly", () => {
    render(
      <QueryClientProvider client={queryClient}>
        <Formik initialValues={{}} onSubmit={jest.fn()}>
          <Taxes product={product} quantity={1} setTaxSaved={jest.fn()} />
        </Formik>
      </QueryClientProvider>
    );
    screen.getByText("Country/Region:");
    expect(screen.getByTestId("select-country")).toBeInTheDocument();
    screen.getByRole("button", { name: "Save" });
  });

  it("When non VAT Country is selected, VAT Number input does not displays", () => {
    render(
      <QueryClientProvider client={queryClient}>
        <Formik initialValues={{}} onSubmit={jest.fn()}>
          <Taxes product="test" quantity={1} setTaxSaved={jest.fn()} />
        </Formik>
      </QueryClientProvider>
    );

    expect(screen.getByTestId("select-country")).toBeInTheDocument();
    fireEvent.change(screen.getByTestId("select-country"), {
      target: { value: "JP" },
    });
  });

  it("When VAT country is selected, VAT Number input displays", () => {
    render(
      <QueryClientProvider client={queryClient}>
        <Formik initialValues={{}} onSubmit={jest.fn()}>
          <Taxes product={product} quantity={1} setTaxSaved={jest.fn()} />
        </Formik>
      </QueryClientProvider>
    );

    expect(screen.getByTestId("select-country")).toBeInTheDocument();
    fireEvent.change(screen.getByTestId("select-country"), {
      target: { value: "FR" },
    });

    expect(screen.getByText("VAT number:")).toBeInTheDocument();
  });

  it("When USA is selected, State select displays", () => {
    const { getByTestId } = render(
      <QueryClientProvider client={queryClient}>
        <Formik initialValues={{}} onSubmit={jest.fn()}>
          <Taxes product="test" quantity={1} setTaxSaved={jest.fn()} />
        </Formik>
      </QueryClientProvider>
    );
    fireEvent.change(getByTestId("select-country"), {
      target: { value: "US" },
    });
    expect(screen.getByText("State:")).toBeInTheDocument();
    fireEvent.change(getByTestId("select-state"), {
      target: { value: "Texas" },
    });
  });
});
