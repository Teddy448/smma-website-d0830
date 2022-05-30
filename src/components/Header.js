import React from 'react';
import Router from 'next/router';
import _ from 'lodash';

import { Link, withPrefix, classNames, getPageUrl } from '../utils';
import Action from './Action';
import Icon from './Icon';

<script>
!function (w, d, t) {
  w.TiktokAnalyticsObject=t;var ttq=w[t]=w[t]||[];ttq.methods=["page","track","identify","instances","debug","on","off","once","ready","alias","group","enableCookie","disableCookie"],ttq.setAndDefer=function(t,e){t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}};for(var i=0;i<ttq.methods.length;i++)ttq.setAndDefer(ttq,ttq.methods[i]);ttq.instance=function(t){for(var e=ttq._i[t]||[],n=0;n<ttq.methods.length;n++)ttq.setAndDefer(e,ttq.methods[n]);return e},ttq.load=function(e,n){var i="https://analytics.tiktok.com/i18n/pixel/events.js";ttq._i=ttq._i||{},ttq._i[e]=[],ttq._i[e]._u=i,ttq._t=ttq._t||{},ttq._t[e]=+new Date,ttq._o=ttq._o||{},ttq._o[e]=n||{};var o=document.createElement("script");o.type="text/javascript",o.async=!0,o.src=i+"?sdkid="+e+"&lib="+t;var a=document.getElementsByTagName("script")[0];a.parentNode.insertBefore(o,a)};

  ttq.load('CAA6E5JC77U59N95045G');
  ttq.page();
}(window, document, 'ttq');
</script>

export default class Header extends React.Component {
    constructor(props) {
        super(props);
        this.handleWindowResize = this.handleWindowResize.bind(this);
        this.handleRouteChange = this.handleRouteChange.bind(this);
        this.menuOpenRef = React.createRef();
    }

    componentDidMount() {
        window.addEventListener('resize', this.handleWindowResize, true);
        Router.events.on('routeChangeStart', this.handleRouteChange);
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.handleWindowResize, true);
        Router.events.off('routeChangeStart', this.handleRouteChange);
    }

    handleWindowResize() {
        const menuOpenElm = _.get(this.menuOpenRef, 'current.offsetParent');
        if (menuOpenElm === null) {
            document.body.classList.remove('js-nav-open');
        }
    }

    handleRouteChange() {
        document.body.classList.remove('js-nav-open');
    }

    handleMenuToggle(event) {
        event.preventDefault();
        document.body.classList.toggle('js-nav-open');
    }

    renderNavLinks(navLinks, pageUrl) {
        return (
            <ul className="menu flex-md items-md-center">
                {_.map(navLinks, (action, index) => {
                    const actionUrl = _.trim(_.get(action, 'url'), '/');
                    const actionStyle = _.get(action, 'style', 'link');
                    return (
                        <li
                            key={index}
                            className={classNames('menu__item', 'ml-md-3', {
                                'is-active': pageUrl === actionUrl && actionStyle === 'link',
                                'menu__item-btn': actionStyle !== 'link'
                            })}
                        >
                            <Action action={action} />
                        </li>
                    )
                })}
            </ul>
        )
    }

    render() {
        const page = _.get(this.props, 'page');
        const pageUrl = _.trim(getPageUrl(page), '/');
        const config = _.get(this.props, 'config');
        const header = _.get(config, 'header');
        const logo = _.get(header, 'logo');
        const logoAlt = _.get(header, 'logo_alt', '');
        const title = _.get(header, 'title');
        const hasPrimaryNav = _.get(header, 'has_primary_nav');
        const primaryNavLinks = _.get(header, 'primary_nav_links');
        const hasSecondaryNav = _.get(header, 'has_secondary_nav');
        const secondaryNavLinks = _.get(header, 'secondary_nav_links');

        return (
            <header className="site-header py-2">
                <div className="container">
                    <nav className="navbar flex items-center" aria-label="Main Navigation">
                        <Link className="sr-only" href="#content">Skip to main content</Link>
                        <div className="navbar__branding mr-2">
                            {logo ? <Link className="navbar__logo m-0" href={withPrefix('/')}><img src={withPrefix(logo)} alt={logoAlt} /></Link>
                                : <Link className="navbar__title h4 m-0" href={withPrefix('/')}>{title}</Link>}
                        </div>
                        {((hasPrimaryNav && !_.isEmpty(primaryNavLinks)) || (hasSecondaryNav && !_.isEmpty(secondaryNavLinks))) && (
                            <React.Fragment>
                                <div className="navbar__container flex-md-auto">
                                    <div className="navbar__scroller">
                                        <div className="navbar__inner">
                                            <button aria-label="Close" className="btn btn--icon btn--clear navbar__close-btn" onClick={this.handleMenuToggle.bind(this)}>
                                                <Icon icon={'close'} />
                                                <span className="sr-only">Close</span>
                                            </button>
                                            <div className="navbar__menu flex-md">
                                                {hasPrimaryNav && !_.isEmpty(primaryNavLinks) && this.renderNavLinks(primaryNavLinks, pageUrl)}
                                                {hasSecondaryNav && !_.isEmpty(secondaryNavLinks) && this.renderNavLinks(secondaryNavLinks, pageUrl)}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <button aria-label="Menu" className="btn btn--icon btn--clear navbar__menu-btn ml-auto" ref={this.menuOpenRef} onClick={this.handleMenuToggle.bind(this)}>
                                    <Icon icon={'menu'} />
                                    <span className="sr-only">Menu</span>
                                </button>
                            </React.Fragment>)
                        }
                    </nav>
                </div>
            </header>
        );
    }
}
