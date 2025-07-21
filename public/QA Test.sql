USE QATest;

--CREATE DATABASE QATest;

--USE master;
--GO
--DROP DATABASE IF EXISTS QATest;
--GO

CREATE TABLE Bugs_List(
	ID INT PRIMARY KEY IDENTITY(1,1),
	Task_Id INT NOT NULL UNIQUE,
	Task_Name NVarchar(500) NOT NULL,
	Task_URL NVarchar(500),
	Statuses VARCHAR(20) CHECK (Statuses IN ('Active','Pending','Closed')),
	Portal VARCHAR(20) CHECK (Portal IN('PenScope','eMember')),
	Comments NVARCHAR(MAX),
	Created_Date DATETIME,
	Updated_Date DATETIME,
	Fixed_Issue_Date DATETIME
);

INSERT INTO Bugs_List (
    Task_Id,
    Task_Name,
    Task_URL,
    Statuses,
    Portal,
    Comments,
    Created_Date,
    Updated_Date,
    Fixed_Issue_Date
)
VALUES (
    1002,
    N'UI glitch on dashboard',
    N'https://yourapp.com/bug-ui-dashboard',
    'Pending',
    'eMember',
    N'Dashboard does not load correctly on Firefox.',
    '2025-07-19 09:15:00',
    '2025-07-19 09:45:00',
    NULL
);


--drop table buglist;

-- Notes
/* 
	* ATETIME format: 'YYYY-MM-DD HH:MM:SS'
	* 🧾 If optional values like Task_URL or Fixed_Issue_Date aren’t available, pass NULL
*/

EXEC InsertInto_BugsList
    @Task_Id = 1001,
    @Task_Name = N'Fix login issue',
    @Task_URL = N'https://example.com/fix-login',
    @Statuses = 'Active',
    @Portal = 'PenScope',
    @Comments = N'Issue occurs on mobile view only.',
    @Created_Date = '2025-07-18 10:30:00',
    @Updated_Date = '2025-07-18 11:00:00',
    @Fixed_Issue_Date = NULL; 

Select * from bugs_list; 


CREATE TABLE list_of_tables (
    ID INT IDENTITY(1,1) PRIMARY KEY,
    Table_Name VARCHAR(50) NOT NULL,
    Table_Details VARCHAR(MAX),
    Portal VARCHAR(20) CHECK (Portal IN ('PenScope', 'eMember')),
    Created_Date DATETIME DEFAULT GETDATE(),
    Updated_Date DATETIME
);


INSERT INTO list_of_tables (Table_Name, Table_Details, Portal, Updated_Date)
VALUES ('Bugs_List', 'Stores user all bugs which i created on PenScope and eMember','PenScope',NULL);

INSERT INTO list_of_tables (Table_Name, Table_Details, Portal, Updated_Date)
VALUES ('Querry_List', 'Stores all IMP Querry which i created on QA Test','PenScope',NULL);

INSERT INTO list_of_tables (Table_Name, Table_Details, Portal, Updated_Date)
VALUES ('list_of_tables', 'Stores all tables list which i created on QA Test','PenScope',NULL);

-- Drop
Select * from list_of_tables;
Select * from Querry_List;


-- IMP Querry List table - stores all imp querry 
CREATE TABLE Querry_List (
    ID INT IDENTITY(1,1) PRIMARY KEY,
    Querry_Name VARCHAR(255) NOT NULL,
    IMP_Querry VARCHAR(MAX) NOT NULL,
    Portal VARCHAR(20) CHECK (Portal IN ('PenScope', 'eMember')),
    Comments VARCHAR(MAX),
    Created_Date DATETIME DEFAULT GETDATE(),
    Updated_Date DATETIME
);


INSERT INTO Querry_List (Querry_Name, IMP_Querry, Portal, Comments)
VALUES ('Get Bugs List','Select * from Bugs_List;' ,'PenScope', 'Get List of bugs present on QA Test');

INSERT INTO Querry_List (Querry_Name, IMP_Querry, Portal, Comments)
VALUES ('Get List tables present','Select * from list_of_tables;' ,'PenScope', 'Get List of tables present on QA Test');

INSERT INTO Querry_List (Querry_Name, IMP_Querry, Portal, Comments)
VALUES ('Get IMP Querry List','Select * from Querry_List;' ,'PenScope', 'Get List of all Imp querry present on QA Test');

--Update Querry_List
--SET Querry_Name = 'Querry_List'
--Where ID = 1;

--Update Querry_List
--SET Comments = 'Stores all IMP Querry created by Me On QA Test.'
--Where ID = 1;

--Drop table Querry_List;
Select * from Querry_List;




