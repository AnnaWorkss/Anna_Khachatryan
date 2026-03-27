class CommonHeader extends HTMLElement {
    connectedCallback() {
        const activePage = this.getAttribute('active-page') || 'home';
        
        this.innerHTML = `
            <header class="header">
                <nav class="navbar">
                    <ul class="navbar">
                        <li class="navbar_section_name ${activePage === 'home' ? 'active_page' : ''}">
                            <a href="../home/index.html">Home</a>
                        </li>
                        <li class="navbar_section_devider"></li>
                        <li class="navbar_section_name ${activePage === 'catalog' ? 'active_page' : ''}">
                            <a href="../catalog/index.html">Catalog</a>
                        </li>
                        <li class="navbar_section_devider"></li>
                        <li class="navbar_section_name ${activePage === 'about' ? 'active_page' : ''}">
                            <a href="../about/index.html">About</a>
                        </li>
                    </ul>
                </nav>
                <div class="logo">
                    <img class="logo_img" src="../../assets/images/Logo.png" alt="logo">
                </div>
                <div class="header_info">
                    <span class="header_info_text">
                        I’m Anna from Armenia, developing through real-world experience and hands-on work with a swiss advertising agency. Driven by curiosity and rapid growth.
                    </span>
                </div>
            </header>
        `;
    }
}

customElements.define('common-header', CommonHeader);
