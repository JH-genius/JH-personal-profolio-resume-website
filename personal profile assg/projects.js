"use strict";

(() => {
  // ===== Project information =====
  const projects = [
    {
      id: "ev-dashboard",
      title: "Smart EV Dashboard Prototype",
      category: "Design",

      description:
        "As part of our Human–Computer Interaction coursework, " +
        "my team and I explored how to improve an electric " +
        "vehicle dashboard. We conducted interviews to understand " +
        "user needs, created low-fidelity wireframes, and developed " +
        "a high-fidelity interface prototype. The design covered " +
        "vehicle information, charging status, and system alerts. " +
        "We documented the research and redesign process in a magazine.",

      contribution:
        "I was mainly responsible for drawing the EV dashboard " +
        "interface layouts. I arranged information and controls " +
        "to make the screens clear and easy to understand.",

      technologies: [
        "User Research",
        "UI/UX Design",
        "Wireframing",
        "Prototyping"
      ],

      outcome:
        "I learned how to translate user needs into interface " +
        "layouts and organise information according to its " +
        "importance. Working with my team also helped me " +
        "understand how wireframes support prototype development " +
        "and communicate design ideas.",

      images: [
        {
          src: "ev-cover.png",
          alt: "Smart EV Dashboard magazine cover"
        },
        {
          src: "ev-wireframe.png",
          alt: "Low-fidelity EV dashboard wireframes"
        },
        {
          src: "ev-prototype.png",
          alt: "High-fidelity EV dashboard prototype"
        }
      ]
    },

    {
      id: "fitlife",
      title: "FitLife Wellness Centre",
      category: "Database",

      description:
        "FitLife Wellness Centre is a web application developed " +
        "using PHP and SQL. It includes an admin dashboard, " +
        "member registration, and reports on memberships, " +
        "class schedules, trainers, finances, and programs.",

      contribution:
        "I mainly contributed to designing the database " +
        "structure and preparing SQL statements and data " +
        "for the system. I also helped with the website's " +
        "interface design.",

      technologies: ["PHP", "SQL", "HTML", "CSS"],

      outcome:
        "This project helped me understand how database tables " +
        "and relationships support a web application. I gained " +
        "experience using SQL to organise and retrieve data, " +
        "and learned how the database and interface work together.",

      images: [
        {
          src: "fitlife-dashboard.png",
          alt: "FitLife admin dashboard"
        },
        {
          src: "fitlife-members.png",
          alt: "FitLife new member registration form"
        },
        {
          src: "fitlife-reports.png",
          alt: "FitLife scheduled classes report"
        }
      ]
    },

    {
      id: "smart-home",
      title: "Smart Home Management Application",
      category: "Design",

      description:
        "This project involved designing a mobile application " +
        "mockup for smart home management. The screens cover " +
        "login and registration, a home dashboard, device " +
        "controls, and automation modes.",

      contribution:
        "I was mainly responsible for drawing the initial " +
        "interface sketches. These sketches helped the team " +
        "plan the screen layouts and discuss how users " +
        "would navigate the application.",

      technologies: [
        "UI/UX Design",
        "Mobile Interface Design",
        "Mockup Design"
      ],

      outcome:
        "I learned how sketches can turn an application idea " +
        "into a visual design. The project helped me practise " +
        "arranging interface elements and planning navigation " +
        "between screens.",

      images: [
        {
          src: "smart-home-mockup.png",
          alt:
            "Smart home application mockup showing login, " +
            "registration, device management and automation"
        }
      ]
    },

    {
      id: "fyp-tracker",
      title: "Final Year Project Submission Tracker",
      category: "Programming",

      description:
        "This C++ console application tracks final year project " +
        "submissions and milestones. Users can add, search, edit, " +
        "delete, and sort project records. The application uses " +
        "linked lists, stacks, and searching and sorting techniques.",

      contribution:
        "I helped my team write parts of the C++ program " +
        "to support the project submission tracker.",

      technologies: [
        "C++",
        "Linked Lists",
        "Stacks",
        "Searching",
        "Sorting"
      ],

      outcome:
        "Through contributing to the code, I improved my " +
        "understanding of C++ and how data structures support " +
        "record management. I also gained experience working " +
        "with teammates on a shared program.",

      images: [
        {
          src: "fyp-output.png",
          alt: "Project tracker console menu and sample output"
        },
        {
          src: "fyp-code.png",
          alt: "C++ project record and milestone stack code"
        }
      ]
    },

    {
      id: "anti-corruption",
      title: "Anti-Corruption Awareness Poster",
      category: "Design",

      description:
        "This group project aimed to raise awareness of the " +
        "harmful effects of corruption. We created a " +
        "Malay-language poster explaining corruption, its " +
        "consequences, prevention measures, and a supporting " +
        "case study.",

      contribution:
        "I was mainly responsible for researching the " +
        "consequences of corruption. I gathered information " +
        "about its effects on individuals, organisations, " +
        "and society for the team to include in the poster.",

      technologies: [
        "Graphic Design",
        "Poster Design",
        "Visual Communication"
      ],

      outcome:
        "I developed my research and information-selection " +
        "skills. I also learned how to summarise findings " +
        "into clear points for an awareness poster and " +
        "gained a better understanding of the importance " +
        "of integrity.",

      images: [
        {
          src: "anti-corruption-poster.png",
          alt:
            "Malay-language anti-corruption poster explaining " +
            "its consequences and prevention measures"
        }
      ]
    }
  ];

  // ===== Page elements =====
  const grid = document.getElementById("projectGrid");
  const search = document.getElementById("projectSearch");
  const filter = document.getElementById("projectFilter");
  const count = document.getElementById("projectCount");
  const empty = document.getElementById("emptyMessage");
  const dialog = document.getElementById("projectDialog");

  const title = document.getElementById("dialogTitle");
  const category = document.getElementById("dialogCategory");
  const description = document.getElementById("dialogDescription");
  const tech = document.getElementById("dialogTech");
  const outcome = document.getElementById("dialogOutcome");
  const image = document.getElementById("slideImage");
  const imageError = document.getElementById("imageError");
  const slideCount = document.getElementById("slideCount");
  const previous = document.getElementById("previousSlide");
  const next = document.getElementById("nextSlide");
  const close = document.getElementById("closeDialog");

  const requiredElements = [
    grid, search, filter, count, empty, dialog,
    title, category, description, tech, outcome,
    image, imageError, slideCount, previous, next, close
  ];

  if (requiredElements.some((node) => !node)) return;

  let activeProject = null;
  let slideIndex = 0;
  let returnFocus = null;

  // ===== Create elements safely =====
  function element(tag, className, text) {
    const node = document.createElement(tag);

    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;

    return node;
  }

  // Add personal contribution before the learning outcome.
  const contributionPanel = element("div", "project-learning");
  const contributionHeading = element(
    "h3",
    "",
    "My Contribution"
  );
  const contributionText = element("p");

  contributionPanel.append(
    contributionHeading,
    contributionText
  );

  outcome.parentElement.before(contributionPanel);

  function addTags(container, technologies) {
    container.replaceChildren();

    technologies.forEach((technology) => {
      container.append(element("span", "", technology));
    });
  }

  // ===== Project cards =====
  function createCard(project) {
    const card = element("article", "project-card");
    const thumbnail = element("div", "project-thumbnail");
    const preview = document.createElement("img");

    preview.alt = project.images[0].alt;
    preview.loading = "lazy";
    preview.decoding = "async";

    preview.addEventListener("error", () => {
      thumbnail.replaceChildren(
        element(
          "span",
          "project-image-fallback",
          "PREVIEW UNAVAILABLE"
        )
      );
    }, { once: true });

    preview.src = project.images[0].src;
    thumbnail.append(preview);

    const body = element("div", "project-card-body");
    const meta = element("div", "project-card-meta");

    const number = String(projects.indexOf(project) + 1)
      .padStart(2, "0");

    meta.append(
      element("span", "project-number", "PROJECT / " + number),
      element("span", "project-category", project.category)
    );

    const tags = element("div", "project-tags");
    addTags(tags, project.technologies);

    const button = element(
      "button",
      "project-open",
      "Explore Project ↗"
    );

    button.type = "button";
    button.setAttribute("aria-label", "Explore " + project.title);

    button.addEventListener("click", () => {
      openProject(project, button);
    });

    body.append(
      meta,
      element("h2", "", project.title),
      element("p", "project-summary", project.description),
      tags,
      button
    );

    card.append(thumbnail, body);
    return card;
  }

  // ===== Search and category filtering =====
  function renderProjects() {
    const query = search.value.trim().toLowerCase();
    const selected = filter.value;

    const results = projects.filter((project) => {
      const matchesCategory =
        selected === "All" || project.category === selected;

      const searchableText = [
        project.title,
        project.category,
        project.description,
        project.contribution,
        ...project.technologies
      ].join(" ").toLowerCase();

      return matchesCategory && searchableText.includes(query);
    });

    grid.replaceChildren(...results.map(createCard));

    count.textContent =
      results.length + " / " + projects.length + " projects displayed";

    empty.hidden = results.length > 0;
  }

  // ===== Image gallery =====
  function showSlide() {
    if (!activeProject) return;

    const slide = activeProject.images[slideIndex];

    image.hidden = false;
    imageError.hidden = true;
    image.alt = slide.alt;
    image.src = slide.src;

    slideCount.textContent =
      (slideIndex + 1) + " / " + activeProject.images.length;

    previous.disabled = slideIndex === 0;
    next.disabled =
      slideIndex === activeProject.images.length - 1;
  }

  function moveSlide(direction) {
    if (!activeProject) return;

    const newIndex = slideIndex + direction;

    if (
      newIndex < 0 ||
      newIndex >= activeProject.images.length
    ) {
      return;
    }

    slideIndex = newIndex;
    showSlide();
  }

  // ===== Project details =====
  function openProject(project, button) {
    activeProject = project;
    slideIndex = 0;
    returnFocus = button;

    title.textContent = project.title;
    category.textContent = project.category;
    description.textContent = project.description;
    contributionText.textContent = project.contribution;
    outcome.textContent = project.outcome;

    addTags(tech, project.technologies);
    showSlide();

    dialog.showModal();
    document.documentElement.classList.add("project-dialog-open");

    close.focus({ preventScroll: true });
    dialog.scrollTop = 0;
  }

  // ===== Event handlers =====
  image.addEventListener("error", () => {
    image.hidden = true;
    imageError.hidden = false;
  });

  search.addEventListener("input", renderProjects);
  filter.addEventListener("change", renderProjects);

const resetButton = document.getElementById("resetProjects");

resetButton?.addEventListener("click", () => {
  search.value = "";
  filter.value = "All";

  renderProjects();
  search.focus();
});

  previous.addEventListener("click", () => moveSlide(-1));
  next.addEventListener("click", () => moveSlide(1));
  close.addEventListener("click", () => dialog.close());

  dialog.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      moveSlide(-1);
    }

    if (event.key === "ArrowRight") {
      event.preventDefault();
      moveSlide(1);
    }
  });

  dialog.addEventListener("close", () => {
    document.documentElement.classList.remove("project-dialog-open");
    returnFocus?.focus({ preventScroll: true });
  });

  renderProjects();
})();