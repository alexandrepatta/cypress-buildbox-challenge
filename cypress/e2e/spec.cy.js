/// <reference types="cypress" />
import "cypress-real-events/support";



describe("Testes Challenge", () => {
  beforeEach(() => {
    cy.visit("https://qastage.buildbox.one/18/cadastro/");
    cy.get("[data-cy=button-btn-enroll]").click();
  });

  describe("Registro de um Usuário com sucesso", () => {
    it("Todas as informações completas", () => {
      const personalData = {
        firstName: "Joao",
        lastName: "Joao",
        birthDate: "01012000",
        cpf: "49386813661",
        email: "test1@hotmail.com",
        emailConfirm: "test1@hotmail.com",
        password: "abcdefgh",
        passwordConfirm: "abcdefgh",
        proficiency: "Advanced",
      };

      cy.fillPersonalData(personalData);

      const addressData = {
        cep: "37537242",
        neighborhood: "Monte Belo",
        street: "Rua Sebastião Ferreira de Moraes",
        number: "123",
      };

      cy.fillAddress(addressData);
    });
  });

  describe("Personal Data Page", () => {
    // Testes de validação para o campo Nome
    describe("Nome", () => {
      const testCases = [
        {
          type: "Campo Nulo",
          input: "1{backspace}",
          expected: "Precisa ser preenchido",
        },
        {
          type: "Menos de 4 caracteres",
          input: "abc",
          expected: "Preencha corretamente",
        },
        {
          type: "Caracteres especiais",
          input: "!@#$",
          expected: "Preencha corretamente",
        },
        { type: "Números", input: "1234", expected: "Preencha corretamente" },
      ];

      testCases.forEach(({ type, input, expected }) => {
        it(`Sinalização ${type}`, () => {
          cy.get("[data-cy=input-signup-personal-data-firstName]")
            .realClick()
            .realType(input);
          cy.get('[class="input-error"]')
            .should("be.visible")
            .and("contain", expected);
        });
      });
    });

    // Testes de validação para o campo Sobrenome
    describe("Sobrenome", () => {
      const testCases = [
        {
          type: "Campo Nulo",
          input: "a{backspace}",
          expected: "Precisa ser preenchido",
        },
        {
          type: "Menos de 4 caracteres",
          input: "abc",
          expected: "Preencha corretamente",
        },
        {
          type: "Caracteres especiais",
          input: "!@#$",
          expected: "Preencha corretamente",
        },
        { type: "Números", input: "1234", expected: "Preencha corretamente" },
      ];

      testCases.forEach(({ type, input, expected }) => {
        it(`Verificação ${type}`, () => {
          cy.get("[data-cy=input-signup-personal-data-lastName]")
            .realClick()
            .realType(input);
          cy.get('[class="input-error"]')
            .should("be.visible")
            .and("contain", expected);
        });
      });
    });

    // Testes de validação para o campo Data de Nascimento
    describe("Data de Nascimento", () => {
      const testCases = [
        {
          type: "Campo Nulo",
          input: "1{backspace}",
          expected: "Data de nascimento inválida.",
        },
        {
          type: "Data inválida",
          input: "15071924",
          expected: "Data de nascimento inválida.",
        },
      ];

      testCases.forEach(({ type, input, expected }) => {
        it(`Verificação ${type}`, () => {
          cy.get("[data-cy=input-signup-personal-data-birthDate]")
            .realClick()
            .realType(input);
          cy.get('[class="input-error"]')
            .should("be.visible")
            .and("contain", expected);
        });
      });
    });

    // Testes de validação para o campo CPF
    describe("CPF", () => {
      const testCases = [
        {
          type: "Campo Nulo",
          input: "1{backspace}",
          expected: "Precisa ser preenchido",
        },
        {
          type: "Não preenchido corretamente",
          input: "1234567890",
          expected: "Preencha corretamente",
        },
        {
          type: "Mais de 11 caracteres",
          input: "123456789000",
          expected: "Precisa corresponder ao formato esperado",
        },
      ];

      testCases.forEach(({ type, input, expected }) => {
        it(`Sinalização ${type}`, () => {
          cy.get("[data-cy=input-signup-personal-data-cpf]")
            .realClick()
            .realType(input);
          cy.get('[class="input-error"]')
            .should("be.visible")
            .and("contain", expected);
        });
      });
    });

    // Testes API para CPF
    describe("Testes API", () => {
      const validCpf = "493.868.136-61";
      const invalidCpf = "123.123.123.12";
      const usedCpf = "114.871.836-23";

      it("Deve validar um CPF válido", () => {
        cy.findAjax().then((ajaxNonce) => {
          cy.request({
            method: "POST",
            url: "https://qastage.buildbox.one/wp-admin/admin-ajax.php",
            body: {
              action: "bx_ep_user_cpf_exists",
              _ajax_nonce: ajaxNonce,
              cpf: validCpf,
            },
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
            },
          })
            .its("status")
            .should("equal", 204);
        });
      });

      it("Não deve validar CPF inválido", () => {
        cy.findAjax().then((ajaxNonce) => {
          cy.request({
            method: "POST",
            url: "https://qastage.buildbox.one/wp-admin/admin-ajax.php",
            body: {
              action: "bx_ep_user_cpf_exists",
              _ajax_nonce: ajaxNonce,
              cpf: invalidCpf,
            },
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
            },
          })
            .its("status")
            .should("equal", 400);
        });
      });

      it("Não deve validar CPF que já foi utilizado", () => {
        cy.findAjax().then((ajaxNonce) => {
          cy.request({
            method: "POST",
            url: "https://qastage.buildbox.one/wp-admin/admin-ajax.php",
            body: {
              action: "bx_ep_user_cpf_exists",
              _ajax_nonce: ajaxNonce,
              cpf: usedCpf,
            },
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
            },
          })
            .its("status")
            .should("equal", 409);
        });
      });
    });
    // Testes de validação para o campo Email
    describe("Email", () => {
      const emailTestCases = [
        {
          type: "campo nulo",
          input: "1{backspace}",
          expected: "Precisa ser preenchido",
        },
        {
          type: "campo com menos de 4 caracteres",
          input: "abc",
          expected: "Insira um e-mail válido",
        },
        {
          type: "formato inválido",
          input: "invalid@email",
          expected: "Email inválido",
        },
      ];

      emailTestCases.forEach(({ type, input, expected }) => {
        it(`Sinalização ${type}`, () => {
          cy.get("[data-cy=input-signup-personal-data-email]")
            .realClick()
            .realType(input);
          cy.get('[class="input-error"]')
            .should("be.visible")
            .and("contain", expected);
        });
      });
    });

    // Testes de validação para o campo Repetir Email
    describe("Repetir Email", () => {
      const repeatEmailTestCases = [
        {
          type: "campo nulo",
          input: "1{backspace}",
          expected: "Precisa ser preenchido",
        },
        {
          type: "campo com menos de 4 caracteres",
          input: "abc",
          expected: "Insira um e-mail válido",
        },
        {
          type: "diferente do email original",
          setup: () =>
            cy
              .get("[data-cy=input-signup-personal-data-email]")
              .realClick()
              .realType("valid@email.com"),
          input: "invalid@email.com",
          expected: "Os e-mails não são iguais.",
        },
      ];

      repeatEmailTestCases.forEach(({ type, setup, input, expected }) => {
        it(`Sinalização ${type}`, () => {
          if (setup) setup();
          cy.get("[data-cy=input-signup-personal-data-email-confirm]")
            .realClick()
            .realType(input);
          cy.get('[class="input-error"]')
            .should("be.visible")
            .and("contain", expected);
        });
      });
    });

    // Testes API para Email
    describe("Testes API", () => {
      const url = "https://qastage.buildbox.one/wp-admin/admin-ajax.php";
      const headers = {
        "Content-Type": "application/x-www-form-urlencoded",
      };

      it("Deve validar um Email válido", () => {
        const validEmail = "test1@exameple.com";
        cy.findAjax().then((ajaxNonce) => {
          cy.request({
            method: "POST",
            url: url,
            body: {
              action: "bx_ep_user_email_exists",
              _ajax_nonce: ajaxNonce,
              cpf: validEmail,
            },
            headers: headers,
          })
            .its("status")
            .should("equal", 204);
        });
      });
      it("Não deve validar E-mail que já foi utilizado", () => {
        const invalidEmail = "invalid@email.com";
        cy.findAjax().then((ajaxNonce) => {
          cy.request({
            method: "POST",
            url: url,
            body: {
              action: "bx_ep_user_email_exists",
              _ajax_nonce: ajaxNonce,
              cpf: invalidEmail,
            },
            headers: headers,
            failOnStatusCode: false, 
          }).then((response) => {

            expect(response.status).to.equal(409);

            const responseBody = response.body;
            expect(responseBody.success).to.be.false;
            expect(responseBody.data).to.be.an("array").that.is.empty;
          });
        });
      });
    });
    // Testes de validação para o campo Senha
    describe("Senha", () => {
      const passwordTestCases = [
        {
          type: "campo nulo",
          input: "1{backspace}",
          expected: "Precisa ser preenchido",
        },
        {
          type: "campo com menos de 4 caracteres",
          input: "abc",
          expected: "Insira uma senha válida",
        },
      ];

      passwordTestCases.forEach(({ type, input, expected }) => {
        it(`Sinalização ${type}`, () => {
          cy.get("[data-cy=input-signup-personal-data-password]")
            .realClick()
            .realType(input);
          cy.get('[class="input-error"]')
            .should("be.visible")
            .and("contain", expected);
        });
      });
    });

    // Testes de validação para o campo Repetir Senha
    describe("Repetir Senha", () => {
      const repeatPasswordTestCases = [
        {
          type: "campo nulo",
          input: "1{backspace}",
          expected: "Precisa ser preenchido",
        },
        {
          type: "campo com menos de 4 caracteres",
          input: "abc",
          expected: "Insira uma senha válida",
        },
        {
          type: "diferente da senha original",
          setup: () =>
            cy
              .get("[data-cy=input-signup-personal-data-password]")
              .realClick()
              .realType("Password99"),
          input: "Password00",
          expected: "As senhas não são iguais.",
        },
      ];

      repeatPasswordTestCases.forEach(({ type, setup, input, expected }) => {
        it(`Sinalização ${type}`, () => {
          if (setup) setup();
          cy.get("[data-cy=input-signup-personal-data-password-confirm]")
            .realClick()
            .realType(input);
          cy.get('[class="input-error"]')
            .should("be.visible")
            .and("contain", expected);
        });
      });
    });

    // Testes de validação para o campo Nível de Proficiência em inglês
    describe("Nível de Proficiência em inglês", () => {
      it("Verificar se as opções são expandidas ao clique", () => {
        cy.contains("Selecione a proficiência...").click();
      });
    });

    // Testes de validação para Termos de Uso e Política de Privacidade
    describe("Termos de Uso e Política de Privacidade", () => {
      it("Verificar se 'Termos de Uso' está vinculado a um link", () => {
        cy.get("a")
          .contains("Termos de Uso")
          .then(($link) => {
            const href = $link.prop("href");
            expect(href).to.not.be.empty;
            expect(href).to.equal("https://qastage.buildbox.one/termos-de-uso");
          });
      });
    });
  });
  describe("Address Page", () => {
    const personalData = {
      firstName: "1234",
      lastName: "1234",
      birthDate: "01012000",
      cpf: "49386813661",
      email: "test1@hotmail.com",
      emailConfirm: "test1@hotmail.com",
      password: "1821471293",
      passwordConfirm: "1821471293",
      proficiency: "Advanced",
    };

    const addressData = {
      cep: "37537242",
      neighborhood: "Centro",
      street: "Rua Exemplo",
      number: "123",
    };

    beforeEach(() => {
      cy.fillPersonalData(personalData);
      cy.get("[data-cy=input-signup-address-cep]").should("be.visible");
      
    });

    // Testes de validação para o campo CEP
    describe("CEP", () => {
      const cepErrorMessages = {
        null: "Precisa ser preenchido",
        short: "Preencha corretamente"
      };
  
      it("Sinalização campo nulo", () => {
        cy.get('[data-cy="input-signup-address-cep"]')
          .realClick()
          .realType("0{backspace}");
        cy.get(".input-error")
          .should("be.visible")
          .and("contain", cepErrorMessages.null);
      });
  
      it("Sinalização campo com menos de 8 caracteres", () => {
        cy.get('[data-cy="input-signup-address-cep"]')
          .realClick()
          .realType("1234567");
        cy.get(".input-error")
          .should("be.visible")
          .and("contain", cepErrorMessages.short);
      });
  
      it("Preenchimento com CEP válido", () => {
        cy.request({
          method: "GET",
          url: `https://brasilapi.com.br/api/cep/v1/${addressData.cep}`,
        }).then((response) => {
          expect(response.status).to.equal(200);
  
          const { city, street } = response.body;
          cy.get('[data-cy="input-signup-address-cep"]')
            .realClick()
            .realType(addressData.cep)
            .wait(1000)
            .realType("{enter}");
  
          cy.get('[data-cy="input-signup-address-city"]').should("have.value", city);
          cy.get('[data-cy="input-signup-address-street"]').should("have.value", street);
        });
      })
    })

    const addressFields = [
      { name: "neighborhood", errorMessage: "Precisa ser preenchido" },
      { name: "street", errorMessage: "Precisa ser preenchido" },
      { name: "number", errorMessage: "Precisa ser preenchido" },
    ];
// Testes de validação para o campo Bairro, rua, número
    addressFields.forEach(({ name, errorMessage }) => {
      describe(name.charAt(0).toUpperCase() + name.slice(1), () => {
        const fieldSelector = `[data-cy=input-signup-address-${name}]`;

        it("Sinalização campo nulo", () => {
          cy.get(fieldSelector).realClick().realType("1{backspace}");
          cy.get(".input-error")
            .should("be.visible")
            .and("contain", errorMessage);
        });
      });
    });
  });
});
