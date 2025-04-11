const skillsData = {
  "user": {
    "name": "Basil",
    "startDate": "2025-04-11",
    "overallProgress": 0,
    "completedSkills": []
  },
  "categories": [
    {
      "id": 1,
      "name": "Pre-Cybersecurity Fundamentals",
      "icon": "graduation-cap",
      "progress": 0,
      "subcategories": [
        {
          "id": "1.1",
          "name": "Networking",
          "progress": 0,
          "skills": [
            {
              "id": "1.1.1",
              "name": "OSI Model",
              "description": "The Open Systems Interconnection model is a conceptual framework used to understand network interactions in seven layers.",
              "progress": 0,
              "subskills": [
                {
                  "id": "1.1.1.1",
                  "name": "Physical Layer",
                  "description": "The lowest layer of the OSI model, dealing with the physical connection between devices, including cables, switches, and the transmission of raw bit streams.",
                  "completed": false,
                  "completedOn": null,
                  "prerequisites": []
                },
                {
                  "id": "1.1.1.2",
                  "name": "Data Link Layer",
                  "description": "Provides node-to-node data transfer between two directly connected nodes, and handles error correction from the physical layer.",
                  "completed": false,
                  "completedOn": null,
                  "prerequisites": ["1.1.1.1"]
                },
                {
                  "id": "1.1.1.3",
                  "name": "Network Layer",
                  "description": "Provides the functional and procedural means of transferring packets from one node to another connected in different networks.",
                  "completed": false,
                  "completedOn": null,
                  "prerequisites": ["1.1.1.2"]
                },
                {
                  "id": "1.1.1.4",
                  "name": "Transport Layer",
                  "description": "Provides the functional and procedural means of transferring variable-length data sequences from a source to a destination host, while maintaining the quality of service.",
                  "completed": false,
                  "completedOn": null,
                  "prerequisites": ["1.1.1.3"]
                },
                {
                  "id": "1.1.1.5",
                  "name": "Session Layer",
                  "description": "Controls the dialogues (connections) between computers, establishing, managing and terminating connections between the local and remote application.",
                  "completed": false,
                  "completedOn": null,
                  "prerequisites": ["1.1.1.4"]
                },
                {
                  "id": "1.1.1.6",
                  "name": "Presentation Layer",
                  "description": "Establishes context between application-layer entities, in which the application-layer entities may use different syntax and semantics.",
                  "completed": false,
                  "completedOn": null,
                  "prerequisites": ["1.1.1.5"]
                },
                {
                  "id": "1.1.1.7",
                  "name": "Application Layer",
                  "description": "The layer closest to the end user, which means both the OSI application layer and the user interact directly with the software application.",
                  "completed": false,
                  "completedOn": null,
                  "prerequisites": ["1.1.1.6"]
                }
              ]
            },
            {
              "id": "1.1.2",
              "name": "TCP/IP Model",
              "description": "The Transmission Control Protocol/Internet Protocol model is a concise version of the OSI model, consisting of four layers that define the standards for the Internet.",
              "progress": 0,
              "completed": false,
              "completedOn": null,
              "prerequisites": ["1.1.1"]
            },
            {
              "id": "1.1.3",
              "name": "Network Protocols",
              "description": "Standardized rules that allow devices to communicate with each other regardless of differences in their internal processes, structure or design.",
              "progress": 0,
              "completed": false,
              "completedOn": null,
              "prerequisites": ["1.1.1", "1.1.2"]
            },
            {
              "id": "1.1.4",
              "name": "Network Devices",
              "description": "Hardware devices that are used to connect computers, printers, fax machines and other electronic devices to a network.",
              "progress": 0,
              "completed": false,
              "completedOn": null,
              "prerequisites": ["1.1.1"]
            },
            {
              "id": "1.1.5",
              "name": "IP Addressing",
              "description": "A logical address that identifies a device on the internet or a local network, allowing devices to communicate with each other.",
              "progress": 0,
              "completed": false,
              "completedOn": null,
              "prerequisites": ["1.1.3"]
            },
            {
              "id": "1.1.6",
              "name": "Subnetting",
              "description": "The practice of dividing a network into two or more networks to improve network performance and security.",
              "progress": 0,
              "completed": false,
              "completedOn": null,
              "prerequisites": ["1.1.5"]
            },
            {
              "id": "1.1.7",
              "name": "Routing and Switching",
              "description": "The process of selecting paths in a network along which to send network traffic and the forwarding of packets between networks.",
              "progress": 0,
              "completed": false,
              "completedOn": null,
              "prerequisites": ["1.1.4", "1.1.6"]
            },
            {
              "id": "1.1.8",
              "name": "Wireless Networks",
              "description": "Computer networks that use wireless data connections between network nodes, such as WiFi.",
              "progress": 0,
              "completed": false,
              "completedOn": null,
              "prerequisites": ["1.1.4"]
            },
            {
              "id": "1.1.9",
              "name": "Network Troubleshooting",
              "description": "The process of identifying, locating and correcting problems in a computer network.",
              "progress": 0,
              "completed": false,
              "completedOn": null,
              "prerequisites": ["1.1.3", "1.1.4", "1.1.7"]
            }
          ]
        },
        {
          "id": "1.2",
          "name": "Operating Systems",
          "progress": 0,
          "skills": [
            {
              "id": "1.2.1",
              "name": "Windows",
              "description": "Microsoft Windows operating system fundamentals, including architecture, security features, and administration.",
              "progress": 0,
              "completed": false,
              "completedOn": null,
              "prerequisites": []
            },
            {
              "id": "1.2.2",
              "name": "Linux",
              "description": "Linux operating system fundamentals, including distributions, command line, file system, and security features.",
              "progress": 0,
              "completed": false,
              "completedOn": null,
              "prerequisites": []
            },
            {
              "id": "1.2.3",
              "name": "macOS",
              "description": "Apple macOS operating system fundamentals, including architecture, security features, and administration.",
              "progress": 0,
              "completed": false,
              "completedOn": null,
              "prerequisites": []
            },
            {
              "id": "1.2.4",
              "name": "Mobile OS",
              "description": "Mobile operating systems like Android and iOS, including architecture, security models, and management.",
              "progress": 0,
              "completed": false,
              "completedOn": null,
              "prerequisites": []
            },
            {
              "id": "1.2.5",
              "name": "OS Hardening",
              "description": "The process of securing an operating system by reducing its vulnerability surface and attack vectors.",
              "progress": 0,
              "completed": false,
              "completedOn": null,
              "prerequisites": ["1.2.1", "1.2.2", "1.2.3"]
            }
          ]
        },
        {
          "id": "1.3",
          "name": "Programming and Scripting",
          "progress": 0,
          "skills": [
            {
              "id": "1.3.1",
              "name": "Python",
              "description": "Python programming language fundamentals for cybersecurity, including syntax, libraries, and security applications.",
              "progress": 0,
              "completed": false,
              "completedOn": null,
              "prerequisites": []
            },
            {
              "id": "1.3.2",
              "name": "Bash",
              "description": "Bash shell scripting for automation and system administration in Unix/Linux environments.",
              "progress": 0,
              "completed": false,
              "completedOn": null,
              "prerequisites": ["1.2.2"]
            },
            {
              "id": "1.3.3",
              "name": "PowerShell",
              "description": "PowerShell scripting for automation and system administration in Windows environments.",
              "progress": 0,
              "completed": false,
              "completedOn": null,
              "prerequisites": ["1.2.1"]
            },
            {
              "id": "1.3.4",
              "name": "JavaScript",
              "description": "JavaScript programming language fundamentals for web security, including syntax and security implications.",
              "progress": 0,
              "completed": false,
              "completedOn": null,
              "prerequisites": []
            },
            {
              "id": "1.3.5",
              "name": "C/C++",
              "description": "C and C++ programming language fundamentals, including memory management and common security vulnerabilities.",
              "progress": 0,
              "completed": false,
              "completedOn": null,
              "prerequisites": []
            },
            {
              "id": "1.3.6",
              "name": "Java",
              "description": "Java programming language fundamentals, including object-oriented concepts and security features.",
              "progress": 0,
              "completed": false,
              "completedOn": null,
              "prerequisites": []
            }
          ]
        },
        {
          "id": "1.4",
          "name": "Database Fundamentals",
          "progress": 0,
          "skills": [
            {
              "id": "1.4.1",
              "name": "SQL",
              "description": "Structured Query Language fundamentals for database management and interaction.",
              "progress": 0,
              "completed": false,
              "completedOn": null,
              "prerequisites": []
            },
            {
              "id": "1.4.2",
              "name": "NoSQL",
              "description": "Non-relational database fundamentals, including document, key-value, and graph databases.",
              "progress": 0,
              "completed": false,
              "completedOn": null,
              "prerequisites": []
            },
            {
              "id": "1.4.3",
              "name": "Database Security",
              "description": "Security principles and practices for protecting database systems and the data they contain.",
              "progress": 0,
              "completed": false,
              "completedOn": null,
              "prerequisites": ["1.4.1", "1.4.2"]
            }
          ]
        },
        {
          "id": "1.5",
          "name": "System Administration",
          "progress": 0,
          "skills": [
            {
              "id": "1.5.1",
              "name": "User Management",
              "description": "Creating, modifying, and managing user accounts and permissions in various operating systems.",
              "progress": 0,
              "completed": false,
              "completedOn": null,
              "prerequisites": ["1.2.1", "1.2.2", "1.2.3"]
            },
            {
              "id": "1.5.2",
              "name": "Service Management",
              "description": "Managing system services, daemons, and processes in various operating systems.",
              "progress": 0,
              "completed": false,
              "completedOn": null,
              "prerequisites": ["1.2.1", "1.2.2", "1.2.3"]
            },
            {
              "id": "1.5.3",
              "name": "Resource Monitoring",
              "description": "Monitoring system resources like CPU, memory, disk, and network usage to ensure optimal performance.",
              "progress": 0,
              "completed": false,
              "completedOn": null,
              "prerequisites": ["1.5.2"]
            },
            {
              "id": "1.5.4",
              "name": "Backup and Recovery",
              "description": "Implementing and managing backup solutions and recovery procedures for systems and data.",
              "progress": 0,
              "completed": false,
              "completedOn": null,
              "prerequisites": ["1.5.1", "1.5.2"]
            },
            {
              "id": "1.5.5",
              "name": "Patch Management",
              "description": "Managing the process of applying updates and patches to software and operating systems.",
              "progress": 0,
              "completed": false,
              "completedOn": null,
              "prerequisites": ["1.5.2"]
            }
          ]
        },
        {
          "id": "1.6",
          "name": "Cloud Computing Fundamentals",
          "progress": 0,
          "skills": [
            {
              "id": "1.6.1",
              "name": "Cloud Service Models",
              "description": "Understanding of IaaS, PaaS, and SaaS cloud service models and their security implications.",
              "progress": 0,
              "completed": false,
              "completedOn": null,
              "prerequisites": []
            },
            {
              "id": "1.6.2",
              "name": "Cloud Deployment Models",
              "description": "Understanding of public, private, hybrid, and community cloud deployment models.",
              "progress": 0,
              "completed": false,
              "completedOn": null,
              "prerequisites": ["1.6.1"]
            },
            {
              "id": "1.6.3",
              "name": "Major Cloud Providers",
              "description": "Familiarity with major cloud providers like AWS, Azure, and Google Cloud Platform.",
              "progress": 0,
              "completed": false,
              "completedOn": null,
              "prerequisites": ["1.6.1"]
            },
            {
              "id": "1.6.4",
              "name": "Virtualization",
              "description": "Understanding of virtualization technologies that underpin cloud computing.",
              "progress": 0,
              "completed": false,
              "completedOn": null,
              "prerequisites": []
            }
          ]
        }
      ]
    },
    {
      "id": 2,
      "name": "Security Fundamentals",
      "icon": "shield-alt",
      "progress": 0,
      "subcategories": [
        {
          "id": "2.1",
          "name": "Security Concepts",
          "progress": 0,
          "skills": [
            {
              "id": "2.1.1",
              "name": "CIA Triad",
              "description": "Understanding of Confidentiality, Integrity, and Availability as the three key principles of information security.",
              "progress": 0,
              "completed": false,
              "completedOn": null,
              "prerequisites": []
            },
            {
              "id": "2.1.2",
              "name": "Authentication, Authorization, and Accounting",
              "description": "Understanding of the AAA framework for controlling access to computer resources, enforcing policies, and auditing usage.",
              "progress": 0,
              "completed": false,
              "completedOn": null,
              "prerequisites": []
            },
            {
              "id": "2.1.3",
              "name": "Non-repudiation",
              "description": "Understanding of methods to ensure that a party cannot deny the authenticity of their signature or sending a message.",
              "progress": 0,
              "completed": false,
              "completedOn": null,
              "prerequisites": ["2.1.1"]
            },
            {
              "id": "2.1.4",
              "name": "Defense in Depth",
              "description": "Understanding of the layered security approach to protect information systems.",
              "progress": 0,
              "completed": false,
              "completedOn": null,
              "prerequisites": ["2.1.1"]
            },
            {
              "id": "2.1.5",
              "name": "Least Privilege",
              "description": "Understanding of the principle that users should only have the minimum levels of access necessary to perform their job functions.",
              "progress": 0,
              "completed": false,
              "completedOn": null,
              "prerequisites": ["2.1.2"]
            },
            {
              "id": "2.1.6",
              "name": "Separation of Duties",
              "description": "Understanding of the principle that no single individual should have control over an entire high-risk transaction.",
              "progress": 0,
              "completed": false,
              "completedOn": null,
              "prerequisites": ["2.1.5"]
            }
          ]
        }
      ]
    }
  ]
}
