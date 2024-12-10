import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { SearchService } from '../../../customer/services/search.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  logged_in: Boolean = false;
  language: String = 'English';
  user_role: String;

  constructor(private translate: TranslateService, private router: Router, private searchService: SearchService) { }


  ngOnInit() {
    
    
  }

  ngDoCheck() {
    this.user_role = sessionStorage.getItem("role");
    // console.log(this.user_role);
    
    const user_session_id = sessionStorage.getItem("user_session_id")
    if (user_session_id) {
      this.logged_in = true;
    }
  }

  switchLanguage(language: string) {
    this.translate.use(language);
    if (language == 'en') {
      this.language = "English";
    } else if (language == 'hn') {
      this.language = "हिंदी(Hindi)";
    }
  }

  logOut() {
    sessionStorage.removeItem("user_session_id");
    sessionStorage.removeItem("role");
    this.router.navigateByUrl('/sign-in');
    location.reload()
  }

  onSearch(event: Event) {
    event.preventDefault();
    const form = event.target as HTMLFormElement;
    const searchValue = (form.querySelector('input') as HTMLInputElement).value;
    this.searchService.setSearchQuery(searchValue);
  }

}
