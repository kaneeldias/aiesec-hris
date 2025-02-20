import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from "@angular/router";
import { AuthService } from "../../auth/auth.service";
import { Opportunity, OpportunityService } from "../opportunity.service";
import { MatDialog } from "@angular/material/dialog";
import { ErrorComponent } from "../../dialogs/error/error.component";
import { Title } from "@angular/platform-browser";

@Component({
	selector: 'app-list-opportunities',
	templateUrl: './list-opportunities.component.html',
	styleUrls: ['./list-opportunities.component.css']
})
export class ListOpportunitiesComponent implements OnInit {

	@Input() showAdminPanel = true;
	@Input() showAlerts = true;
	@Input() forceLogin = true;

	opportunities?: Opportunity[];
	loading = true;

	constructor(private route: ActivatedRoute, public authService: AuthService,
		public opportunityService: OpportunityService, private dialog: MatDialog, private titleService: Title) {
	}

	async ngOnInit(): Promise<void> {
		if (this.showAlerts) this.titleService.setTitle(`Opportunities | ASL 360°`);
		if (!await this.authService.isLoggedIn() && this.forceLogin) await this.authService.login();

		try {
			this.opportunities = await this.opportunityService.getOpportunities();
		} catch (e) {
			if (this.showAlerts) this.dialog.open(ErrorComponent, { data: e });
		}

		this.loading = false;
	}

}
