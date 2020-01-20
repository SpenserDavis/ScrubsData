USE [C81_ScrubsData]
GO
/****** Object:  StoredProcedure [dbo].[ProvidersReport_SelectAll_Details]    Script Date: 1/20/2020 11:34:56 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

/* ======================================================
AUTHOR: Spenser Davis
Name: Providers Report - Select Details for ALL providers
Description: grabs specified details pertaining
to all providers (and all associated table data through
numerous joins)
===========================================================*/

ALTER PROC [dbo].[ProvidersReport_SelectAll_Details]	
	
	@professionalDetails bit = 0
	,@practices bit = 0
	,@affiliations bit = 0
	,@certifications bit = 0
	,@expertise bit = 0
	,@languages bit = 0
	,@licenses bit = 0
	,@specializations bit = 0

AS

/* ==========================================================
	DECLARE			
		@professionalDetails bit = 1
		,@practices bit = 1
		,@affiliations bit = 1
		,@certifications bit = 1
		,@expertise bit = 1
		,@languages bit = 1
		,@licenses bit = 1
		,@specializations bit = 1

	EXEC [dbo].[ProvidersReport_SelectAll_Details]		
		@professionalDetails
		,@practices
		,@affiliations
		,@certifications
		,@expertise
		,@languages
		,@licenses
		,@specializations
================================================================*/

BEGIN
	
	SELECT
		[p].[Id]
		,[tt].[Name] as Title		
		,[up].[FirstName]
		,[up].[Mi]
		,[up].[LastName]
		,[gt].[Name] as Gender
		,[p].[Phone]
		,[p].[Fax]	
		,[u].Email	
		,[u].Id
		,p.DateAttested
		,(SELECT
			COUNT(1)
			FROM
				dbo.providers as pro
			WHERE 
				pro.id=p.id
				and dbo.LastAttested(p.DateAttested) < 90
		) as [Compliant?]
		,(SELECT
			CASE
				WHEN @professionalDetails = 1
					THEN
						(SELECT
							[pd].Id
							,[pd].[NPI]
							,gt.[Name] as gendersAccepted					
						FROM
							dbo.ProfessionalDetails as pd
							join dbo.Providers as pro
								on pd.ProviderId = pro.Id
							join dbo.GenderTypes as gt
								on gt.Id=pd.GenderAccepted
						WHERE 
							pro.Id=p.Id							
						FOR JSON PATH, WITHOUT_ARRAY_WRAPPER
						)
				ELSE NULL
			END
		) AS ProfessionalDetails		
		,(SELECT
			CASE
				WHEN @practices = 1
					THEN
						(SELECT			
							pra.Id
							,pra.[Name]
							,(JSON_QUERY
								(
									(SELECT 
										pra2.Phone
										,pra2.Fax
										,pra2.Email
										,pra2.SiteUrl
									FROM
										dbo.Practices as pra2						
									WHERE
										pra2.Id=pra.Id
									FOR JSON PATH, WITHOUT_ARRAY_WRAPPER
									)
								)
							) as Contact							
							,pra.ADA_Accessible as isAdaAccessible
							,gt.[Name] as gendersAccepted
							,ft.[Name] as facilityType
							,(JSON_QUERY
								(
									(SELECT
										l.Id
										,lt.[Name] as locationType
										,l.LineOne
										,l.LineTwo
										,l.City
										,s.[Name] as [State]
										,l.Zip
									FROM
										dbo.Locations as l
										join dbo.LocationTypes as lt
											on lt.Id=l.LocationTypeId
										join dbo.States as s
											on s.Id=l.StateId		
									WHERE
										pra.LocationId=l.Id
									FOR JSON PATH, WITHOUT_ARRAY_WRAPPER
									)
								)
							) as [Location]							
							,(SELECT
								sa.Id
								,sa.ScheduleId
								,sa.[DayOfWeek]
								,sa.StartTime
								,sa.EndTime
							FROM
								dbo.ScheduleAvailability as sa	
								join dbo.Practices as p
									on p.ScheduleId = sa.ScheduleId	
							WHERE
								sa.ScheduleId=pra.ScheduleId
							FOR JSON AUTO
							) as Schedule
						FROM
							dbo.Practices as pra
							join dbo.PracticeProviders as pp
								on pp.PracticeId=pra.Id							
							join dbo.FacilityTypes as ft
								on ft.Id=pra.FacilityTypeID
																		
							join dbo.GenderTypes as gt
								on gt.Id=pra.GenderAccepted
							join Providers as pro
								on pro.Id=pp.ProviderId							
						WHERE 
							p.Id=pro.Id
						FOR JSON PATH
						)
				ELSE NULL
			END		
		) as Practices
		,(SELECT
			CASE
				WHEN @affiliations = 1
					THEN
						(SELECT
							a.Id
							,[a].[Name]
							,aft.[Name]	as [Type]			
						FROM
							Affiliations as a
							join dbo.ProviderAffiliations as pa
								on pa.AffiliationId = a.Id
							join dbo.AffiliationTypes as aft
								on aft.Id=a.AffiliationTypeId
							join dbo.Providers as pro
								on pro.Id=pa.ProviderId
						WHERE
							pro.Id = p.Id
						FOR JSON PATH
						)
				ELSE NULL
			END
		) as Affiliations
		,(SELECT
			CASE
				WHEN @certifications = 1
					THEN
						(SELECT				
							c.Id
							,c.[Name]
						FROM
							certifications as c
							join dbo.ProviderCertifications as pc
								on pc.certificationId = c.Id
							join Providers as pro
								on pro.Id=pc.providerId
						WHERE
							pro.Id = p.Id
						FOR JSON PATH
						)
				ELSE NULL
			END
		) as Certifications
		,(SELECT
			CASE
				WHEN @expertise = 1
					THEN
						(SELECT
							et.Id
							,et.[Name]
						FROM 
							dbo.ExpertiseTypes as et
							join dbo.ProviderExpertise as pe
								on et.Id=pe.ExpertiseId
							join dbo.Providers as p2
								on pe.ProviderId=p2.Id
						WHERE
							p2.Id=p.Id
						FOR JSON PATH
						)
				ELSE NULL
			END
		) as Expertise
		,(SELECT
			CASE
				WHEN @languages = 1
					THEN
						(SELECT			
							la.Id
							,la.[Name]
						FROM
							dbo.Languages as la
							join dbo.ProviderLanguages as pl
								on la.Id = pl.LanguageId
							join Providers as pro
								on pro.Id=pl.ProviderId
						WHERE
							pro.Id=p.Id
						FOR JSON PATH
						)
				ELSE NULL
			END
		) as Languages
		,(SELECT
			CASE
				WHEN @licenses = 1
					THEN
						(SELECT		
							l.Id
							,l.LicenseNumber
							,l.DateExpires
							,s2.[Name] as [State]						
						FROM
							dbo.Licenses as l
							join dbo.States as s2
								on l.LicenseStateId=s2.Id
							join ProviderLicenses as pl
								on pl.LicenseId=l.Id
							join Providers as pro
								on pro.Id=pl.ProviderId
						WHERE
							pro.Id = p.Id
						FOR JSON PATH
						)
				ELSE NULL
			END
		) as Licenses	
		,(SELECT
			CASE
				WHEN @specializations = 1
					THEN
						(SELECT
							sp.Id
							,sp.[Name]
							,[ps].[IsPrimary]							
						FROM
							dbo.Specialization as sp
							join dbo.ProviderSpecialization as ps
								on sp.Id = ps.SpecializationId
							join dbo.Providers as pro
								on pro.Id = ps.ProviderId
						WHERE
							pro.Id=p.Id		
						FOR JSON PATH
						)
				ELSE NULL
			END
		) as Specializations
	
	FROM
		dbo.Providers as p
		left join dbo.UserProfiles as up
			on p.UserProfileId = up.Id
		left join dbo.TitleTypes as tt
			on tt.Id = p.TitleTypeId
		left join dbo.GenderTypes as gt
			on gt.Id=p.GenderTypeId
		join dbo.Users as u
			on u.Id=up.UserId		

END