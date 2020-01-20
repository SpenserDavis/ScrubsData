USE [C81_ScrubsData]
GO
/****** Object:  StoredProcedure [dbo].[Subscriptions_AuthCheck]    Script Date: 1/20/2020 11:38:38 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

/* ======================================================
AUTHOR: Spenser Davis
Name: Subscriptions - Auth Check
Desc: checks active status, api key, plan type, and req count
===========================================================*/

ALTER PROC [dbo].[Subscriptions_AuthCheck]		
	
	@apiKey uniqueidentifier

AS

/* ==========================================================
	EXEC [dbo].[Subscriptions_SelectAll]	
	
	DECLARE				
		@apiKey uniqueidentifier = //REDACTED	

	EXEC [dbo].[Subscriptions_AuthCheck]			
		@apiKey

	EXEC [dbo].[Subscriptions_SelectAll]	

================================================================*/

BEGIN
	
	SET NOCOUNT ON;

	DECLARE @dbKey bit = (SELECT
										1
									FROM
										dbo.Subscriptions
									WHERE
										ApiKey=@apiKey)

	IF @dbKey is null
		BEGIN;
			THROW 51023, 'Invalid API Key', 1;
		END
	   

	DECLARE @isActive bit = (SELECT
									IsActive
								FROM
									dbo.Subscriptions
								WHERE
									ApiKey=@apiKey)

	IF @isActive =0 OR @isActive is null
		BEGIN;
			THROW 51022, 'Subscription not active', 1;
		END
	
	

	DECLARE @currDate datetime2(7) = getutcdate();

	DECLARE @lastSubbed datetime2(7) = (SELECT
											LastSubscribedDate
										FROM
											dbo.Subscriptions
										WHERE
											ApiKey=@apiKey)
	
	DECLARE @daysElapsed int = dbo.LastAttested(@lastSubbed);

	DECLARE @subModel nvarchar(50) = (SELECT
											SubscriptionType
										FROM
											dbo.SubscriptionTypes as st
											join dbo.UserSubscriptions as us
												on us.SubscriptionTypeId = st.Id
											join dbo.Subscriptions as s
												on s.UserId = us.UserId
										WHERE
											s.ApiKey=@apiKey)

	DECLARE @userId int = (SELECT
								UserId
							FROM										
								dbo.Subscriptions
							WHERE
								ApiKey=@apiKey)

	IF @subModel = 'Limited'
		BEGIN
			IF @daysElapsed > 30
				BEGIN
					DECLARE @nearestSubDateDistance int = @daysElapsed % 30;

					DECLARE @newSubscribedDate datetime2(7)
					= DATEADD(DAY, @daysElapsed - @nearestSubDateDistance, @lastSubbed) 

					EXEC dbo.Subscriptions_Update_ReqCountAndSubDate @userId, @newSubscribedDate

				END
			ELSE
				BEGIN
					DECLARE @reqCount int = (SELECT
												RequestCount
											FROM
												dbo.Subscriptions
											WHERE
												ApiKey=@apiKey)

					IF @reqCount >= 1000
						BEGIN;
							THROW 51024, 'Maximum API requests exceeded for period. Please consider upgrading your data plan.', 1;
						END
				END

		END

END