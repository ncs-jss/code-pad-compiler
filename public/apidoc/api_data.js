define({ "api": [
  {
    "type": "get",
    "url": "/api/question/day/day_no.",
    "title": "Return the questions for the day",
    "group": "Questions",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object[]",
            "optional": false,
            "field": "questions",
            "description": "<p>Question list</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "questions._id",
            "description": "<p>Question id</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "questions.question",
            "description": "<p>Question statement</p>"
          },
          {
            "group": "Success 200",
            "type": "String[]",
            "optional": false,
            "field": "questions.input",
            "description": "<p>Question input</p>"
          },
          {
            "group": "Success 200",
            "type": "String[]",
            "optional": false,
            "field": "questions.output",
            "description": "<p>Question output</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "questions.day",
            "description": "<p>Question day</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success",
          "content": "HTTP/1.1 200 OK\n\t[{\n\t\t\"_id\":\"5b8d2e908a54035801ae7564\",\n\t\t\"question\":\"WAP to input two numbers and print sum.\",\n\t\t\"input\":[\"5\\n5\",\"5\\n4\",\"5\\n3\"],\n\t\t\"output\":[\"10\",\"9\",\"8\"],\n\t\t\"day\":1\n\t}]",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Find error",
          "content": "HTTP/1.1 404 NOT FOUND",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "server/routes/questionRoutes.js",
    "groupTitle": "Questions",
    "name": "GetApiQuestionDayDay_no"
  },
  {
    "type": "post",
    "url": "/api/question/add",
    "title": "Add questions",
    "group": "Questions",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "question",
            "description": "<p>Question statement</p>"
          },
          {
            "group": "Parameter",
            "type": "String[]",
            "optional": false,
            "field": "input",
            "description": "<p>Question input</p>"
          },
          {
            "group": "Parameter",
            "type": "String[]",
            "optional": false,
            "field": "output",
            "description": "<p>Question output</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "day",
            "description": "<p>Question day</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Input",
          "content": "{\n\t\"question\":\"WAP to input two numbers and print sum.\",\n\t\"input\":[\"5\\n5\",\"5\\n4\",\"5\\n3\"],\n\t\"output\":[\"10\",\"9\",\"8\"],\n\t\"day\":1\n}",
          "type": "json"
        }
      ]
    },
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Authorization",
            "description": "<p>Token of admin</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Header",
          "content": "{\"x-auth\": \"JWT xyz.abc.123.hgf\"}",
          "type": "json"
        }
      ]
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "questions._id",
            "description": "<p>Question id</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "questions.question",
            "description": "<p>Question statement</p>"
          },
          {
            "group": "Success 200",
            "type": "String[]",
            "optional": false,
            "field": "questions.input",
            "description": "<p>Question input</p>"
          },
          {
            "group": "Success 200",
            "type": "String[]",
            "optional": false,
            "field": "questions.output",
            "description": "<p>Question output</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "questions.day",
            "description": "<p>Question day</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success",
          "content": "HTTP/1.1 200 OK\n\t{\n\t\t\"_id\":\"5b8d2e908a54035801ae7564\",\n\t\t\"question\":\"WAP to input two numbers and print sum.\",\n\t\t\"input\":[\"5\\n5\",\"5\\n4\",\"5\\n3\"],\n\t\t\"output\":[\"10\",\"9\",\"8\"],\n\t\t\"day\":1\n\t}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Find error",
          "content": "HTTP/1.1 401 Unauthorised",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "server/routes/questionRoutes.js",
    "groupTitle": "Questions",
    "name": "PostApiQuestionAdd"
  },
  {
    "type": "post",
    "url": "/api/question/submit",
    "title": "Submit solution",
    "group": "Questions",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "code",
            "description": "<p>Question solution</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "lang",
            "description": "<p>Language used</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "admission_no",
            "description": "<p>User Admission No.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "name",
            "description": "<p>User name</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "ques_id",
            "description": "<p>Question id</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Input",
          "content": "{\n\t\"code\":\"#include.........\",\n\t\"lang\": \"c/cpp/java/python\",\n\t\"admission_no\":\"16it028\",\n\t\"name\":\"Shobhit Agarwal\",\n\t\"ques_id\":\"9875fdnkdnfowur9we93\"\n}",
          "type": "json"
        }
      ]
    },
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Authorization",
            "description": "<p>Token of admin</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "status",
            "description": "<p>Submission Status</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>Solution Status</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success",
          "content": "HTTP/1.1 200 OK\n\t{\n\t\t\"status\":\"success\",\n\t\t\"message\":\"Correct/Wrong\"\n\t}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Find error",
          "content": "HTTP/1.1 201 ERROR\n\t{\n\t\t\"error\":\"nfnfnmlem[mswf\",\n\t\t\"errorType\":\"Compile_Time\"\n\t}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "server/routes/questionRoutes.js",
    "groupTitle": "Questions",
    "name": "PostApiQuestionSubmit"
  },
  {
    "type": "get",
    "url": "/api/user/leaderboard",
    "title": "Return leaderboard",
    "group": "Users",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Authorization",
            "description": "<p>Token of admin</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Header",
          "content": "{\"x-auth\": \"JWT xyz.abc.123.hgf\"}",
          "type": "json"
        }
      ]
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String[]",
            "optional": false,
            "field": "users",
            "description": "<p>User list</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "users.name",
            "description": "<p>User name</p>"
          },
          {
            "group": "Success 200",
            "type": "String[]",
            "optional": false,
            "field": "users.admission_no",
            "description": "<p>User admission_no</p>"
          },
          {
            "group": "Success 200",
            "type": "String[]",
            "optional": false,
            "field": "users.questions_solved",
            "description": "<p>User Questions Solved</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success",
          "content": "HTTP/1.1 200 OK\n\t[{\n\t        \"name\": \"Shubham\",\n\t        \"admission_no\": \"17EC060\",\n\t        \"questions_solved\": 3\n\t}]",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Find error",
          "content": "HTTP/1.1 401 NOT Authenticated",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "server/routes/userRoutes.js",
    "groupTitle": "Users",
    "name": "GetApiUserLeaderboard"
  },
  {
    "type": "post",
    "url": "/api/user/login",
    "title": "Login Users",
    "group": "Users",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "username",
            "description": "<p>User username</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "password",
            "description": "<p>User password</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Input",
          "content": "{\n\t\"username\":\"username\",\n\t\"password\":\"password\"\n}",
          "type": "json"
        }
      ]
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>Login Status</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success",
          "content": "HTTP/1.1 200 OK Header {\"x-auth\": \"JWT xyz.abc.123.hgf\"}\n\t{\n\t\t\"message\":\"Successful/Invalid Credentials\"\n\t}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Find error",
          "content": "HTTP/1.1 401 Unauthorised",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "server/routes/userRoutes.js",
    "groupTitle": "Users",
    "name": "PostApiUserLogin"
  }
] });
