USE [C81_ScrubsData]
GO
/****** Object:  StoredProcedure [dbo].[Users_Update_Password_Cycle]    Script Date: 1/20/2020 11:39:50 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

/*===============================================================
Author: Spenser Davis
Name: Users - Update Password Cycle
Description: updates password, deletes token if there is one
=================================================================*/
ALTER PROC [dbo].[Users_Update_Password_Cycle]

	@password nvarchar(100)
	,@id int = 0
	,@token nvarchar(100) = ''	

AS

/*===============================================================================
	case 1: user id provided, no token provided
	DECLARE
		@password nvarchar(100) = 'Password12345!'
		,@id int = 207

	SELECT * FROM DBO.Users WHERE Id = @id

	EXEC [dbo].[Users_Update_Password_Cycle]
		@password
		,@id	

	SELECT * FROM DBO.Users WHERE Id = @id

	case 2: token provided, no user id provided
	DECLARE
		@password nvarchar(100) = 'Password1234!'
		,@id int = 0
		,@token nvarchar(100) = '1229B872-8DD5-44AA-B091-192DAFF201B1'

	SELECT * FROM DBO.Users WHERE Id = 207

	EXEC [dbo].[Users_Update_Password_Cycle]
		@password
		,@id
		,@token

	SELECT * FROM DBO.Users WHERE Id = 207

=================================================================================*/

BEGIN

	IF @token != ''
		BEGIN
			SET @id = (SELECT
							[UserId]			
						FROM 
							[dbo].[UserTokens]
						WHERE 
							[Token] = @token)
		END
	
	BEGIN TRY
		BEGIN TRANSACTION
			EXEC dbo.Users_Update_Password @password, @id

			IF @token != ''
				BEGIN
					EXEC dbo.UserTokens_DeleteToken_ById @id
				END
		COMMIT
	END TRY
	BEGIN CATCH
		IF @@TRANCOUNT > 0
			ROLLBACK;
			THROW 51026, 'Unable to Update Password.', 1;
	END CATCH
	
END