Cypress.Commands.add("findAjax", () => {
  const TestCpf = "11487183623";
  let ajaxNonce = "";

  return cy
    .intercept(
      "POST",
      "https://qastage.buildbox.one/wp-admin/admin-ajax.php",
      (req) => {
        const bodyString = req.body;
        const ajaxNonceMatch = bodyString.match(
          /name="_ajax_nonce"\r\n\r\n([^\r\n]+)/
        );

        if (ajaxNonceMatch && ajaxNonceMatch[1]) {
          ajaxNonce = ajaxNonceMatch[1];
        }

        console.log("Valor do _ajax_nonce:", ajaxNonce);
        req.continue();
      }
    )
    .as("postRequest")
    .then(() => {
      cy.get("[data-cy=input-signup-personal-data-cpf]")
        .realClick()
        .realType(TestCpf)
        .realType("{enter}");

      return cy.wait("@postRequest").then(() => {
        return ajaxNonce;
      });
    });
});

Cypress.Commands.add("fillPersonalData", (data) => {
    cy.get("[data-cy=input-signup-personal-data-firstName]").type(data.firstName);
    cy.get("[data-cy=input-signup-personal-data-lastName]").type(data.lastName);
    cy.get("[data-cy=input-signup-personal-data-birthDate]").type(data.birthDate);
    cy.get("[data-cy=input-signup-personal-data-cpf]").type(data.cpf);
    cy.get("[data-cy=input-signup-personal-data-email]").type(data.email);
    cy.get("[data-cy=input-signup-personal-data-email-confirm]").type(
      data.emailConfirm
    );
    cy.get("[data-cy=input-signup-personal-data-password]").type(data.password);
    cy.get("[data-cy=input-signup-personal-data-password-confirm]").type(
      data.passwordConfirm
    );
    cy.contains("Selecione a proficiência...").click();
    cy.contains(data.proficiency).click();
    cy.get('[type="checkbox"]').check();
    cy.get("[data-cy=button-signup_submit_button_1]").click();
  }
)
  
Cypress.Commands.add("fillAddress", (data) => {
    cy.get('[data-cy="input-signup-address-cep"]').type(data.cep);
    cy.get('[data-cy="input-signup-address-neighborhood"]').type(
      data.neighborhood
    );
    cy.get('[data-cy="input-signup-address-street"]').type(data.street);
    cy.get('[data-cy="input-signup-address-number"]').type(data.number);
  })