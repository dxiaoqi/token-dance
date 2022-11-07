import React, { useEffect, useState } from 'react'
import querystring from 'querystring'
export default function ScanCode() {
    useEffect(() => {
        const search = querystring.parse(window.location.search);
        const cid = search.cid;
        const tid = search.tid;
        if (tid, cid) {
          // 去读列表，读取票信息，显示扫码信息，确认是否入会
        }
    }, [])

    return (
        <div>
        </div>
    )
}