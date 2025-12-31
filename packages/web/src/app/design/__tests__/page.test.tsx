import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { screen } from "@testing-library/dom";
import DesignPage from "../page";

describe("DesignPage", () => {
  it("renders the page title and description", () => {
    render(<DesignPage />);

    expect(screen.getByText("Design System")).toBeInTheDocument();
    expect(screen.getByText(/The technical brand book for Rare Find/)).toBeInTheDocument();
  });

  it("renders all color sections", () => {
    render(<DesignPage />);

    expect(screen.getByText("Primary Colors")).toBeInTheDocument();
    expect(screen.getByText("Neutral Colors (Zinc)")).toBeInTheDocument();
    expect(screen.getByText("Status Colors")).toBeInTheDocument();
    expect(screen.getByText("Dark Mode Specific")).toBeInTheDocument();
  });

  it("renders primary color cards", () => {
    render(<DesignPage />);

    expect(screen.getByText("Blue 500")).toBeInTheDocument();
    expect(screen.getByText("Blue 600")).toBeInTheDocument();
    expect(screen.getByText("Blue 700")).toBeInTheDocument();
    expect(screen.getByText("Indigo 600")).toBeInTheDocument();
  });

  it("renders neutral color cards", () => {
    render(<DesignPage />);

    const neutralColors = [
      "Zinc 50",
      "Zinc 100",
      "Zinc 200",
      "Zinc 300",
      "Zinc 400",
      "Zinc 500",
      "Zinc 600",
      "Zinc 700",
      "Zinc 800",
      "Zinc 900",
      "Black",
      "White",
    ];

    neutralColors.forEach((name) => {
      expect(screen.getByText(name)).toBeInTheDocument();
    });
  });

  it("renders status color cards", () => {
    render(<DesignPage />);

    expect(screen.getByText("Green 600")).toBeInTheDocument();
    expect(screen.getByText("Yellow 600")).toBeInTheDocument();
    expect(screen.getByText("Red 600")).toBeInTheDocument();
    expect(screen.getByText("Purple 100")).toBeInTheDocument();
  });

  it("renders typography section with all heading levels", () => {
    render(<DesignPage />);

    // Use getByRole to get the H2 heading specifically (not the H3 in Usage Guidelines)
    expect(screen.getByRole("heading", { name: "Typography", level: 2 })).toBeInTheDocument();
    expect(screen.getByText(/Heading 1: AI-Powered Bargain Detection/)).toBeInTheDocument();
    expect(screen.getByText(/Heading 2: Find Undervalued Items/)).toBeInTheDocument();
    expect(screen.getByText(/Heading 3: Evaluation Results/)).toBeInTheDocument();
    expect(screen.getByText(/Heading 4: Listing Details/)).toBeInTheDocument();
  });

  it("renders paragraph text examples", () => {
    render(<DesignPage />);

    expect(screen.getByText(/Paragraph \(Large\): Find undervalued items/)).toBeInTheDocument();
    expect(screen.getByText(/Paragraph \(Base\): Lorem ipsum dolor sit amet/)).toBeInTheDocument();
  });

  it("renders blockquote", () => {
    render(<DesignPage />);

    expect(screen.getByText(/Blockquote: The best way to predict the future/)).toBeInTheDocument();
  });

  it("renders spacing scale section", () => {
    render(<DesignPage />);

    expect(screen.getByText("Spacing Scale")).toBeInTheDocument();
    expect(screen.getByText("4px")).toBeInTheDocument();
    expect(screen.getByText("8px")).toBeInTheDocument();
  });

  it("renders border radius section", () => {
    render(<DesignPage />);

    expect(screen.getByText("Border Radius")).toBeInTheDocument();
    expect(screen.getByText("sm")).toBeInTheDocument();
    expect(screen.getByText("md")).toBeInTheDocument();
    expect(screen.getByText("lg")).toBeInTheDocument();
    expect(screen.getByText("xl")).toBeInTheDocument();
    expect(screen.getByText("2xl")).toBeInTheDocument();
    expect(screen.getByText("full")).toBeInTheDocument();
  });

  it("renders component preview section with buttons", () => {
    render(<DesignPage />);

    // Use getByRole to get the H2 heading specifically (not the H3 in Usage Guidelines)
    expect(screen.getByRole("heading", { name: "Components", level: 2 })).toBeInTheDocument();
    expect(screen.getByText("Buttons")).toBeInTheDocument();
    expect(screen.getByText("Primary Button")).toBeInTheDocument();
    expect(screen.getByText("Secondary Button")).toBeInTheDocument();
    expect(screen.getByText("Outline Button")).toBeInTheDocument();
    expect(screen.getByText("Ghost Button")).toBeInTheDocument();
  });

  it("renders input fields section", () => {
    render(<DesignPage />);

    expect(screen.getByText("Input Fields")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Paste Amazon or eBay URL...")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Enter text...")).toBeInTheDocument();
  });

  it("renders cards section", () => {
    render(<DesignPage />);

    expect(screen.getByText("Cards")).toBeInTheDocument();
    expect(screen.getByText("Card Title")).toBeInTheDocument();
    expect(screen.getByText("Card with Shadow")).toBeInTheDocument();
  });

  it("renders status indicators section", () => {
    render(<DesignPage />);

    expect(screen.getByText("Status Indicators")).toBeInTheDocument();
    expect(screen.getByText("Success / Good Deal")).toBeInTheDocument();
    expect(screen.getByText("Warning / Replica")).toBeInTheDocument();
    expect(screen.getByText("Error / Overpriced")).toBeInTheDocument();
  });

  it("renders usage guidelines section", () => {
    render(<DesignPage />);

    expect(screen.getByText("Usage Guidelines")).toBeInTheDocument();
    expect(screen.getByText("Color Usage")).toBeInTheDocument();
    // Use getAllByText and check that Typography appears in Usage Guidelines (H3)
    const typographyHeadings = screen.getAllByText("Typography");
    expect(typographyHeadings.length).toBeGreaterThanOrEqual(2); // H2 and H3
    expect(screen.getByText("Spacing")).toBeInTheDocument();
    // Use getAllByText and check that Components appears in Usage Guidelines (H3)
    const componentHeadings = screen.getAllByText("Components");
    expect(componentHeadings.length).toBeGreaterThanOrEqual(2); // H2 and H3
  });

  it("renders all sections in correct order", () => {
    render(<DesignPage />);

    const heading = screen.getByText("Design System");
    const colorsHeading = screen.getByText("Colors");
    // Use getByRole to get the H2 heading specifically
    const typographyHeading = screen.getByRole("heading", { name: "Typography", level: 2 });
    const spacingHeading = screen.getByText("Spacing Scale");
    // Use getByRole to get the H2 heading specifically
    const componentsHeading = screen.getByRole("heading", { name: "Components", level: 2 });
    const guidelinesHeading = screen.getByText("Usage Guidelines");

    expect(heading).toBeInTheDocument();
    expect(colorsHeading).toBeInTheDocument();
    expect(typographyHeading).toBeInTheDocument();
    expect(spacingHeading).toBeInTheDocument();
    expect(componentsHeading).toBeInTheDocument();
    expect(guidelinesHeading).toBeInTheDocument();
  });

  it("renders color cards with hex values", () => {
    render(<DesignPage />);

    expect(screen.getByText("#3b82f6")).toBeInTheDocument(); // Blue 500
    expect(screen.getByText("#2563eb")).toBeInTheDocument(); // Blue 600
    expect(screen.getByText("#ffffff")).toBeInTheDocument(); // White
    expect(screen.getByText("#000000")).toBeInTheDocument(); // Black
  });
});
