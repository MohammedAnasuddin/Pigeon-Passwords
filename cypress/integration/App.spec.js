describe("Password Generator App", () => {
    beforeEach(() => {
        cy.visit("http://localhost:5173"); // Replace with the correct URL
    });

    it("adds tags correctly", () => {
        cy.get('input[placeholder="Enter words and press Enter"]').type("secure{enter}");
        cy.get("div").contains("secure").should("exist");
    });

    it("shows error if tag contains only symbols", () => {
        cy.get('input[placeholder="Enter words and press Enter"]').type("!!!{enter}");
        cy.get("p").contains("Tags cannot contain only symbols").should("exist");
    });

    it("generates and displays password", () => {
        cy.get('input[placeholder="Enter words and press Enter"]').type("secure{enter}trust{enter}");
        cy.get("button").contains("Generate Password").click();
        cy.contains("Generated Password").should("exist");
    });
});
